package edu.sjsu.go;

public class EventUtils implements Comparable<EventUtils> {
    private String id;
    private String name;
    private int points;

    public EventUtils(String id, String name, int points) {
        this.id = id;
        this.name = name;
        this.points = points;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    @Override
    public String toString() {
        return this.points + " points - " + this.name;
    }

    @Override
    public int compareTo(EventUtils other) {
        return points - other.points;
    }
}
