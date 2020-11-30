package edu.sjsu.go;

public class OrdersItem {
    private String mImageResource;
    private String mOrderID;
    private String mOrderPts;
    private String mOrderCrDate;
    private String mOrderStatus;

    public OrdersItem(String imageResource, String name, String pts,
                      String crDate, String status) {
        mImageResource = imageResource;
        mOrderID       = name;
        mOrderPts      = pts;
        mOrderCrDate   = crDate;
        mOrderStatus   = status;
    }

    public String getImageResource() {
        return "http://10.0.0.207:3001/download/image/?name=" + mImageResource;
    }

    public String getOrderName() {
        return mOrderID;
    }

    public String getOrderPts() {
        return mOrderPts;
    }

    public String getOrderCrDate() {
        return mOrderCrDate;
    }

    public String getOrderStatus() {
        return mOrderStatus;
    }
}
