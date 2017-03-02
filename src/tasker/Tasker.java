package tasker;

import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.scene.Scene;
import javafx.stage.Stage;


public class Tasker extends Application {
    @Override
    public void start(Stage primaryStage) {
        int w = 800, h = 800;
        Map map = new Map();
        Scene scene = new Scene(map, w, h);
        primaryStage.setTitle("Tasker");
        primaryStage.setScene(scene);
        primaryStage.show();
        map.setWidth((double) w);
        map.setHeight((double) h);
        
        scene.widthProperty().addListener(new ChangeListener<Number>() {
            @Override public void changed(ObservableValue<? extends Number> observableValue, Number oldSceneWidth, Number newSceneWidth) {
                map.setWidth((double) newSceneWidth);
            }
        });
        scene.heightProperty().addListener(new ChangeListener<Number>() {
            @Override public void changed(ObservableValue<? extends Number> observableValue, Number oldSceneHeight, Number newSceneHeight) {
                map.setHeight((double) newSceneHeight);
            }
        });
    }

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        launch(args);
    }
}
