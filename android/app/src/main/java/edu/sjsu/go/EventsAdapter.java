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

public class EventsAdapter extends RecyclerView.Adapter<EventsAdapter.EventsHolder> {
    private Context mContext;
    private ArrayList<EventsItem> mEventsList;
    private OnItemClickListener mListener;

    public interface OnItemClickListener {
        void onItemClick(int position);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        mListener = listener;
    }

    public EventsAdapter(Context context, ArrayList<EventsItem> eventsList) {
        mContext = context;
        mEventsList = eventsList;
    }

    @NonNull
    @Override
    public EventsHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.events_item, parent, false);
        EventsHolder eh = new EventsHolder(v);
        return eh;
    }

    @Override
    public void onBindViewHolder(@NonNull EventsHolder holder, int position) {
        EventsItem currentItem = mEventsList.get(position);

        Picasso.with(mContext).load(currentItem.getImageResource()).fit().centerInside().
                into(holder.mImageView);
        holder.mEventTitle.setText(currentItem.getEventName());
        holder.mEventDate.setText("Submitted on : " + currentItem.getEventCrDate());
        holder.mEventPts.setText("Points : " + currentItem.getEventPts());
        holder.mEventStatus.setText("Status : " + currentItem.getEventStatus());
    }

    @Override
    public int getItemCount() {
        return mEventsList.size();
    }

    public class EventsHolder extends RecyclerView.ViewHolder {
        public ImageView mImageView;
        public TextView mEventTitle;
        public TextView mEventDate;
        public TextView mEventPts;
        public TextView mEventStatus;

        public EventsHolder(@NonNull View itemView) {
            super(itemView);
            mImageView = itemView.findViewById(R.id.event_image);
            mEventTitle = itemView.findViewById(R.id.event_title);
            mEventDate = itemView.findViewById(R.id.event_desc);
            mEventPts = itemView.findViewById(R.id.event_points);
            mEventStatus = itemView.findViewById(R.id.event_status);

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
