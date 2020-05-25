package edu.sjsu.go;

public class ItemsItem {
    private String mImageResource;
    private String mItemTitle;
    private String mItemCategory;
    private String mItemID;
    private String[] mItemSizes;
    private String[] mItemAttributes;
    private int[] mItemQuantities;

    public ItemsItem(String imageResource, String title, String cat, String id, String[] sizes,
                     String[] attributes, int[] quantities) {
        mImageResource  = imageResource;
        mItemTitle      = title;
        mItemCategory   = cat;
        mItemID         = id;
        mItemSizes      = sizes;
        mItemAttributes = attributes;
        mItemQuantities = quantities;
    }

    public String getImageResource() {
        return mImageResource;
    }

    public String getItemTitle() {
        return mItemTitle;
    }

    public String getItemCategory() {
        return mItemCategory;
    }

    public String getItemID() {
        return mItemID;
    }

    public String[] getItemSizes() {
        return mItemSizes;
    }

    public String[] getmItemAttributes() {
        return mItemAttributes;
    }

    public int[] getmItemQuantities() {
        return mItemQuantities;
    }
}
