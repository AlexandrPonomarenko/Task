/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tasker;

import java.util.ArrayList;
import java.lang.Integer;
import java.util.Arrays;
import java.util.List;
import javafx.application.Platform;

/**
 *
 * @author theone
 */
public class Paths {
    private ArrayList<Path> paths;
    private double startX;
    private double startY;
    private int [][] mp;

    Paths(double startX, double startY, ArrayList<Task> points) {
        int i;
        int [] arr = new int[points.size()];
        this.startX = startX;
        this.startY = startY;
        paths = new ArrayList<Path>();
        
        for (i = 0; i < arr.length; i++) {
            arr[i] = i;
        }

        mp = toArray(createPaths(arr));
        createElements(points);
    }

    public Integer [][] getPath() {
        int i, lastPath = 0;
        double lastDistance = paths.get(0).getDistance();
        for (i = 1; i < paths.size(); i++) {
            double d = paths.get(i).getDistance();
            if (lastDistance > d) {
                lastDistance = d;
                lastPath = i;
            }
        }
        return paths.get(lastPath).getPath();
    }

    private void createElements (ArrayList<Task> points) {
        int i, j;
        
        for (i = 0; i < mp.length; i++) {
            Path path_ = new Path();

            for (j = 0; j < mp[i].length; j++) {
                Integer p1, p2;
                double x1, y1, x2, y2;

                if (j > 0) {
                    p1 = mp[i][j - 1];
                } else {
                    p1 = 0;
                }
                
                p2 = mp[i][j];
                if (j - 1 < 0) {
                    p1 = null;
                    x1 = startX;
                    y1 = startY;
                } else {
                    x1 = points.get(p1).getLat();
                    y1 = points.get(p1).getLng();
                }

                x2 = points.get(p2).getLat();
                y2 = points.get(p2).getLng();
                path_.addStep(p1, p2, x1, y1, x2, y2);
            }
//            Platform.runLater(new Runnable() {
//                @Override public void run() {
//                    paths.add(path_);
//                }
//            });
            paths.add(path_);
        }
    }
    
    private int [][] toArray (List<String> list) {
        int i, j;

        int[][] arr = new int [list.size()][list.get(0).length()];
        for (i = 0; i < arr.length; i++) {
            char [] charArr = list.get(i).toCharArray();
            for (j = 0; j < charArr.length; j++) {
                arr[i][j] = Integer.parseInt(charArr[j] + "");
            }
        }
        return arr;
    }
    
    private List<String> createPaths(int[] arr) {

        List<String> l = new ArrayList<String>();
        for (StringBuilder sb : orders(arr)) {

                l.add(sb.toString());
        }
        return l;
    }
    
    private List<StringBuilder> orders(int[] arr) {
        if (arr.length == 2) {

            StringBuilder sb1 = new StringBuilder();
            sb1.append(arr[0]);
            sb1.append(arr[1]);

            StringBuilder sb2 = new StringBuilder();
            sb2.append(arr[1]);
            sb2.append(arr[0]);

            return Arrays.asList(sb1, sb2);
        }
        else {

            List<StringBuilder> l = new ArrayList<StringBuilder>();
            for (int i = 0; i < arr.length; i++) {
                for (StringBuilder sb : orders(excludingCopy(arr, i))) {

                    l.add(sb.insert(0, arr[i]));
                }
            }
            return l;
        }
    }

    private int[] excludingCopy(int[] arr, int idx) {
        int[] result = new int[arr.length - 1];
        for (int i = 0, j = 0; i < arr.length; i++) {
            if (i != idx) {
                result[j++] = arr[i];
            }
        }
        return result;
    }
}
