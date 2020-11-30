package edu.sjsu.go;

public class EventsItem {
    private String mImageResource;
    private String mEventName;
    private String mEventDesc;
    private String mEventPts;
    private String mEventCrDate;
    private String mEventUpDate;
    private String mEventStatus;

    public EventsItem(String imageResource, String name, String desc, String pts,
                      String crDate, String upDate, String status) {
        mImageResource = imageResource;
        mEventName     = name;
        mEventDesc     = desc;
        mEventPts      = pts;
        mEventCrDate   = crDate;
        mEventUpDate   = upDate;
        mEventStatus   = status;
    }

    public String getImageResource() {
        return ConstantUtils.DOMAIN_URL + ConstantUtils.URL_IMAGE_PATH + mImageResource;
    }

    public String getEventName() {
        return mEventName;
    }

    public String getEventDesc() {
        return mEventDesc;
    }

    public String getEventPts() {
        return mEventPts;
    }

    public String getEventCrDate() {
        return mEventCrDate;
    }

    public String getEventUpDate() {
        return mEventUpDate;
    }

    public String getEventStatus() {
        return mEventStatus;
    }
}
