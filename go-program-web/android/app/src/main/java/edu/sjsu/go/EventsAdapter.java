package edu.sjsu.go;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class EventsAdapter extends RecyclerView.Adapter<EventsAdapter.EventsHolder> {
    private ArrayList<EventsItem> mEventsList;

    public EventsAdapter(ArrayList<EventsItem> eveentsList) {
        mEventsList = eveentsList;
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

        holder.mImageView.setImageResource(currentItem.getImageResource());
        holder.mEventTitle.setText(currentItem.getEventTitle());
        holder.mEventDate.setText(currentItem.getEventDate());
    }

    @Override
    public int getItemCount() {
        return mEventsList.size();
    }

    public static class EventsHolder extends RecyclerView.ViewHolder {
        public ImageView mImageView;
        public TextView mEventTitle;
        public TextView mEventDate;

        public EventsHolder(@NonNull View itemView) {
            super(itemView);
            mImageView = itemView.findViewById(R.id.event_image);
            mEventTitle = itemView.findViewById(R.id.event_title);
            mEventDate = itemView.findViewById(R.id.event_date);
        }
    }
}
