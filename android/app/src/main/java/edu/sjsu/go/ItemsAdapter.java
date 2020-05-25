package edu.sjsu.go;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class ItemsAdapter extends RecyclerView.Adapter<ItemsAdapter.ItemsHolder> {
    private Context mContext;
    private ArrayList<ItemsItem> mItemsList;
    private OnItemClickListener mListener;

    public ItemsAdapter(Context context, ArrayList<ItemsItem> itemsList) {
        mContext = context;
        mItemsList = itemsList;
    }

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        mListener = listener;
    }

    public ItemsAdapter(ArrayList<ItemsItem> eventsList) {
        mItemsList = eventsList;
    }

    @NonNull
    @Override
    public ItemsHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
       // View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.items_item, parent, false);
        View v = LayoutInflater.from(mContext).inflate(R.layout.items_item, parent, false);
        ItemsHolder eh = new ItemsHolder(v);
        return eh;
    }

    @Override
    public void onBindViewHolder(@NonNull ItemsHolder holder, int position) {
        ItemsItem currentItem = mItemsList.get(position);

        Picasso.with(mContext).load(currentItem.getImageResource()).fit().centerInside().
                into(holder.mImageView);
        //holder.mImageView.setImageResource(currentItem.getImageResource());
        holder.mItemTitle.setText(currentItem.getItemTitle());
        holder.mItemCategory.setText("Points required: " + currentItem.getItemCategory());
    }

    @Override
    public int getItemCount() {
        return mItemsList.size();
    }

    public class ItemsHolder extends RecyclerView.ViewHolder {
        public ImageView mImageView;
        public TextView mItemTitle;
        public TextView mItemCategory;

        public ItemsHolder(@NonNull View itemView) {
            super(itemView);
            mImageView = itemView.findViewById(R.id.item_image);
            mItemTitle = itemView.findViewById(R.id.item_title);
            mItemCategory = itemView.findViewById(R.id.item_category);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(mListener != null) {
                        int position = getAdapterPosition();
                        if (position != RecyclerView.NO_POSITION) {
                            mListener.onItemClick(position);
                        }
                    }
                }
            });
        }
    }
}
