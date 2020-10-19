//
//  OrdersController.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 10/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class OrdersController: UIViewController {
    
    var ordersArray = [GOOrder]()
    
    //  MARK: - Properties
    
    let tableView = UITableView()
    
    // This delegate is required to handle menu toggling
    var delegate: HomeContollerDelegate?
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        title = "Orders"
        // Can't see background if tableView fills entire screen
        view.backgroundColor = .blue
        
        // Might need to remove this for title to show up
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
    
    func configureUI() {
        
        let cancelImage = UIImage(named: "icon_cancel")!
                
        navigationController?.navigationBar.barTintColor = .darkGray
        navigationController?.navigationBar.barStyle     = .black
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Orders"
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: cancelImage.withRenderingMode(.alwaysOriginal),
                                                    style: .plain, target: self, action: #selector(handleDismiss))

    }
    
    func configureTableView() {
        view.addSubview(tableView)
        
        // Set delegates
        setTableViewDelegates()
        tableView.rowHeight = 100
        
        // register cells
        tableView.register(OrderCell.self, forCellReuseIdentifier: "OrderCell")
        tableView.pin(to: view)
    }
    
    func setTableViewDelegates() {
        tableView.delegate = self
        tableView.dataSource = self
    }
    
}

extension OrdersController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // return length of json data here
        print("Number of orders is ", ordersArray.count)
        return ordersArray.count
    }
    
    // This function creats a new cell every time we scroll and new cells appear in the list
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "OrderCell") as! OrderCell
        let order = ordersArray[indexPath.row]
        cell.set(order: order)
        
        return cell
    }
    
}
