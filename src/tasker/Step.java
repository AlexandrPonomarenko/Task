/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tasker;

/**
 *
 * @author theone
 */
public class Step {
    private Integer point1;
    private Integer point2;
    private double x1;
    private double y1;
    private double x2;
    private double y2;
    private double distance;

    Step (Integer point1, Integer point2, double x1, double y1, double x2, double y2) {
        this.point1 = point1;
        this.point2 = point2;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        culcDistance();
    }
    private void culcDistance () {
        distance = Math.abs(Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
    }
    public double getDistance() {
        return distance;
    }
    public Integer getPoint1(){
        return point1;
    }
    public int getPoint2(){
        return point2;
    }
}
