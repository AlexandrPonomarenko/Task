package tasker;

import java.util.ArrayList;
import javafx.beans.property.ReadOnlyDoubleProperty;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.concurrent.Worker;
import javafx.scene.Parent;
//import javafx.scene.layout.GridPane;
//import javafx.scene.layout.Priority;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;

public class Map extends Parent {
    Map() {
        tasks = new ArrayList();
        initMap();
        initCommunication();  
        getChildren().add(webView);
    }

    public void setHeight (double h) {
        webView.setPrefHeight(h);
    }
    public void setWidth (double h) {
        webView.setPrefWidth(h);
    }

    private void initMap()
    {
        webView = new WebView();
        webEngine = webView.getEngine();
        webEngine.setJavaScriptEnabled(true);
        webEngine.load(getClass().getResource("html/map.html").toExternalForm());        
        ready = false;
        webEngine.getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>()
        {
            @Override
            public void changed(final ObservableValue<? extends Worker.State> observableValue,
                                final Worker.State oldState,
                                final Worker.State newState)
            {
                if (newState == Worker.State.SUCCEEDED)
                {
                    ready = true;
                }
            }
        });
    }

    private void initCommunication() {
        webEngine.getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>()
        {
            @Override
            public void changed(final ObservableValue<? extends Worker.State> observableValue,
                                final Worker.State oldState,
                                final Worker.State newState)
            {
                if (newState == Worker.State.SUCCEEDED)
                {
                    doc = (JSObject) webEngine.executeScript("window");
                    doc.setMember("app", Map.this);
                }
            }
        });
    }

    private void invokeJS(final String str) {
        if(ready) {
            doc.eval(str);
        }
        else {
            webEngine.getLoadWorker().stateProperty().addListener(new ChangeListener<Worker.State>()
            {
                @Override
                public void changed(final ObservableValue<? extends Worker.State> observableValue,
                                    final Worker.State oldState,
                                    final Worker.State newState)
                {
                    if (newState == Worker.State.SUCCEEDED)
                    {
                        doc.eval(str);
                    }
                }
            });
        }
    }
    
    public void createNewTask(double lat, double lng, String title, String description) {
        Task t = new Task(lat, lng, title, description);
        tasks.add(t);
        replaceMarker();
    }
    public void findWay (double lat, double lng) {
        Paths p = new Paths(lat, lng, tasks);
        Integer [][] path = p.getPath();
        showTheWay(path);
    }
    
    public void removeTask (int id) {
        tasks.remove(id);
    }

    public ReadOnlyDoubleProperty widthProperty() {
        return webView.widthProperty();
    }
    
    public void showTheWay(Integer [][] arr) {
        int i;
        String str = "";
        for (i = 0; i < arr.length; i++) {
            str += arr[i][0];
            str += ",";
            str += arr[i][1];
            if (i != arr.length - 1) {
                str += ";";
            }
        }
        invokeJS("showWay(\"" + str + "\")");
    }
    
    public void replaceMarker() {
        invokeJS("replaceMarker()");
    }
    
    private ArrayList<Task> tasks;
    private JSObject doc;
    private WebView webView;
    private WebEngine webEngine;
    private boolean ready; 
}
