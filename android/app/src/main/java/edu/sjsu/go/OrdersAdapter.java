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

public class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.OrdersHolder> {
    private Context mContext;
    private ArrayList<OrdersItem> mOrdersList;
    private OnItemClickListener mListener;

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        mListener = listener;
    }

    public OrdersAdapter(Context context, ArrayList<OrdersItem> ordersList) {
        mContext = context;
        mOrdersList = ordersList;
    }

    @NonNull
    @Override
    public OrdersHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.orders_item, parent, false);
        OrdersHolder eh = new OrdersHolder(v);
        return eh;
    }

    @Override
    public void onBindViewHolder(@NonNull OrdersHolder holder, int position) {
        OrdersItem currentItem = mOrdersList.get(position);

        Picasso.with(mContext).load(currentItem.getImageResource()).fit().centerInside().
                into(holder.mImageView);
        holder.mOrderTitle.setText("Order Id #" + currentItem.getOrderName());
        holder.mOrderDate.setText("Created on : " + currentItem.getOrderCrDate());
        holder.mOrderPts.setText("Points : " + currentItem.getOrderPts());
        holder.mOrderStatus.setText("Status : " + currentItem.getOrderStatus());
    }

    @Override
    public int getItemCount() {
        return mOrdersList.size();
    }

    public class OrdersHolder extends RecyclerView.ViewHolder {
        public ImageView mImageView;
        public TextView mOrderTitle;
        public TextView mOrderDate;
        public TextView mOrderPts;
        public TextView mOrderStatus;

        public OrdersHolder(@NonNull View itemView) {
            super(itemView);
            mImageView = itemView.findViewById(R.id.order_image);
            mOrderTitle = itemView.findViewById(R.id.order_no);
            mOrderDate = itemView.findViewById(R.id.order_date);
            mOrderPts = itemView.findViewById(R.id.order_points);
            mOrderStatus = itemView.findViewById(R.id.order_status);

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
