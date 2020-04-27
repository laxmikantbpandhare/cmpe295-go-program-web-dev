package edu.sjsu.go;

import android.os.Parcel;
import android.os.Parcelable;

public class EventUtils implements Comparable<EventUtils>, Parcelable {
    private String id;
    private String name;
    private int points;

    public EventUtils(String id, String name, int points) {
        this.id = id;
        this.name = name;
        this.points = points;
    }

    protected EventUtils(Parcel in) {
        id = in.readString();
        name = in.readString();
        points = in.readInt();
    }

    public static final Creator<EventUtils> CREATOR = new Creator<EventUtils>() {
        @Override
        public EventUtils createFromParcel(Parcel in) {
            return new EventUtils(in);
        }

        @Override
        public EventUtils[] newArray(int size) {
            return new EventUtils[size];
        }
    };

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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(name);
        dest.writeInt(points);
    }
}
