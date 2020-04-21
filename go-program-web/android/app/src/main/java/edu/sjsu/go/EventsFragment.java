package edu.sjsu.go;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class EventsFragment extends Fragment {

    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View rootView = inflater.inflate(R.layout.fragment_events, container, false);

        ArrayList<EventsItem> eventsList = new ArrayList<>();
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 1", "Today"));
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 2", "Today"));
        eventsList.add(new EventsItem(R.drawable.ic_events, "Event 3", "Today"));

        mRecyclerView = (RecyclerView) rootView.findViewById(R.id.recylerView);
        mRecyclerView.setHasFixedSize(true);
        mAdapter = new EventsAdapter(eventsList);

        mRecyclerView.setLayoutManager(new LinearLayoutManager(getActivity()));
        mRecyclerView.setAdapter(mAdapter);

        return rootView;
    }
}
