/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tasker;
import java.lang.Enum;

/**
 *
 * @author theone
 */
public class Task {
    private String title;
    private String description;
    private double lat;
    private double lng; 

    Task(double lat, double lng, String title, String description){
        this.lat = lat;
        this.lng = lng;
        this.title = title;
        this.description = description;
    }
    public double getLat(){
        return lat;
    }
    public double getLng(){
        return lng;
    }
    public String getTitle(){
        return title;
    }
    public String getDescription(){
        return description;
    }
}
