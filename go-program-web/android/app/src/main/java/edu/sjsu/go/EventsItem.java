package edu.sjsu.go;

public class EventsItem {
    private int mImageResource;
    private String mEventTitle;
    private String mEventDate;

    public EventsItem(int imageResource, String title, String date) {
        mImageResource = imageResource;
        mEventTitle    = title;
        mEventDate     = date;
    }

    public int getImageResource() {
        return mImageResource;
    }

    public String getEventTitle() {
        return mEventTitle;
    }

    public String getEventDate() {
        return mEventDate;
    }
}
