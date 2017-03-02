/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tasker;

import java.util.ArrayList;

/**
 *
 * @author theone
 */
public class Path {
    private ArrayList<Step> steps;
    private double distance;
    Path(){
        steps = new ArrayList();
        distance = 0;
    }
    public void addStep(Integer point1, Integer point2, double x1, double y1, double x2, double y2) {
        Step step = new Step(point1, point2, x1, y1, x2, y2);
        distance += step.getDistance();
        steps.add(step);
    }
    public Integer[][] getPath(){
        int i;
        Integer [][] path = new Integer[steps.size()][2];
        for (i = 0; i < path.length; i++) {
            path[i][0] = steps.get(i).getPoint1();
            path[i][1] = steps.get(i).getPoint2();
        }
        return path;
    }
    public double getDistance(){
        return distance;
    }
}
