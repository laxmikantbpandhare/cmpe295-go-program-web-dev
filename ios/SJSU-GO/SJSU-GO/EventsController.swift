//
//  EventsController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class EventsController: UIViewController {
    
    var eventsArray = [GOEvent]()
    
    //  MARK: - Properties
    
    let tableView = UITableView()
    
    // This delegate is required to handle menu toggling
    var delegate: HomeContollerDelegate?
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        /*eventsArray.append(GOEventTemp(title: "Event 1"))
        eventsArray.append(GOEventTemp(title: "Event 2"))
        eventsArray.append(GOEventTemp(title: "Event 3"))
        eventsArray.append(GOEventTemp(title: "Event 4"))
        eventsArray.append(GOEventTemp(title: "Event 5"))*/
        
        // This title is used
        title = "Events"
        navigationController?.navigationBar.barTintColor = #colorLiteral(red: 0.9529411793, green: 0.6862745285, blue: 0.1333333403, alpha: 1)
        navigationController?.navigationBar.barStyle     = .black
        
        // Can't see background if tableView fills entire screen
        view.backgroundColor = #colorLiteral(red: 0.1764705926, green: 0.4980392158, blue: 0.7568627596, alpha: 1)
        //configureUI()
        configureTableView()

        // Do any additional setup after loading the view.
    }
    
    // MARK: - Selectors
    
    @objc func handleDismiss() {
        dismiss(animated: true, completion: nil)
    }
    
    // MARK: - Handlers
    
    @objc func handleMenuToggle() {
        print("Toggle menu..")
        delegate?.handleMenuToggle(forMenuOption: nil)
    }
    
    // This is not called
    func configureUI() {
        
        let cancelImage = UIImage(named: "icon_cancel")!
                
        navigationController?.navigationBar.barTintColor = #colorLiteral(red: 0.9529411793, green: 0.6862745285, blue: 0.1333333403, alpha: 1)
        navigationController?.navigationBar.barStyle     = .black
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Events1"
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: cancelImage.withRenderingMode(.alwaysOriginal),
                                                           style: .plain, target: self, action: #selector(handleDismiss))

    }
    
    func configureTableView() {
        view.addSubview(tableView)
        
        // Set delegates
        setTableViewDelegates()
        tableView.rowHeight = 150
        
        // register cells
        tableView.register(EventCell.self, forCellReuseIdentifier: "EventCell")
        tableView.pin(to: view)
        
        tableView.separatorColor = #colorLiteral(red: 0.9529411793, green: 0.6862745285, blue: 0.1333333403, alpha: 1)
    }
    
    func setTableViewDelegates() {
        tableView.delegate = self
        tableView.dataSource = self
    }
    
}

extension EventsController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // return length of json data here
        print("Number of events is ", eventsArray.count)
        return eventsArray.count
    }
    
    // This function creats a new cell every time we scroll and new cells appear in the list
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "EventCell") as! EventCell
        let event = eventsArray[indexPath.row]
        cell.set(event: event)
        
        return cell
    }
    
}
