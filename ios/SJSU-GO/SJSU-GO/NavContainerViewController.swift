//
//  ContainerViewController.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 9/27/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

struct myEventsResp : Codable {
    let success: Bool
    let events: [myEvent]
}

struct myEvent : Codable {
    let images: [String]
    let event: Event
    // Add student struct here to get points update
    let status: String
    let description: String
    let createdDate: String
}

struct myOrdersResp : Codable {
    let success: Bool
    let orders: [myOrder]
}

struct myOrder : Codable {
    let items: [ItemData]
    // Add student struct here to get points update
    let status: String
    let points: Int
    let createdDate: String
}

struct ItemData : Codable {
    let size: String
    let item: Item
}

struct Item : Codable {
    let images: [String]
    let name: String
}

class NavContainerViewController: UIViewController {
    
    var menuController: NavMenuController!
    var centralController: UIViewController!
    var isExpanded = false
    var lResp: LoginResponse!
    var studentId = ""
    
    var evResp: myEventsResp!
    var eventsArray = [GOEvent]()
    
    var orResp: myOrdersResp!
    var ordersArray = [GOOrder]()
    
    // MARK: - Properties
    
    // MARK: - Init
    
    override func viewDidLoad() {
        print("Inside container view controller")
        super.viewDidLoad()
        configureDashboardController()
        studentId = lResp.user.id
    }
    
    // MARK: - Handlers
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .darkContent
    }
    
    func configureDashboardController() {
        
        let dashboardController = DashboardController()
        dashboardController.delegate = self  // Takes care of menu button toggle
        dashboardController.lResp = self.lResp
        centralController = UINavigationController(rootViewController: dashboardController)
        
        view.addSubview(centralController.view)
        addChild(centralController)
        centralController.didMove(toParent: self)
    }
    
    func configureEventsController() {
        
        let eventsController = EventsController()
        centralController    = UINavigationController(rootViewController: eventsController)
        
        view.addSubview(centralController.view)
        addChild(centralController)
        centralController.didMove(toParent: self)
    }
    
    func configureRedeemController() {
        
        let redeemController = RedeemController()
        centralController    = UINavigationController(rootViewController: redeemController)
        
        view.addSubview(centralController.view)
        addChild(centralController)
        centralController.didMove(toParent: self)
    }
    
    func configureMenuController() {
        if menuController == nil {
            // Add menu controller here
            menuController = NavMenuController()
            //menuController.delegate = self
            view.insertSubview(menuController.view, at: 0)
            addChild(menuController)
            menuController.didMove(toParent: self)
            print("Did add menu controller")
            menuController.delegate = self
        }
    }
    
    func animatePanel(shouldExpand: Bool, menuOption: MenuOption?) {
        
        if shouldExpand {
            
            // Show menu
            UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0,
                           options: .curveEaseOut, animations: {
                self.centralController.view.frame.origin.x = self.centralController.view.frame.width - 80
            }, completion: nil)
            
        } else {
            
            // Hide menu
            UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0,
                           options: .curveEaseOut, animations: {
                self.centralController.view.frame.origin.x = 0
            }) { (_) in
                // Completion handler
                print("Closing menu and loading", menuOption.debugDescription)
                guard let menuOption = menuOption else { return }
                self.didSelectMenuOption(menuOption: menuOption)
            }
        }
        
        animateStatusBar()
    }
    
    func didSelectMenuOption(menuOption: MenuOption) {
        switch menuOption {
        case .Dashboard:
            print("Show dashboard")
            let controller = DashboardController()
            // Can pass variables from here to controller using controller.variable
            present(UINavigationController(rootViewController: controller), animated: true, completion: nil)
        case .Events:
            print("Show Events")
            getMyEvents()
        case .Redeem:
            print("Show Redeem")
            let controller = RedeemController()
            // Can pass variables from here to controller using controller.variable
            present(UINavigationController(rootViewController: controller), animated: true, completion: nil)
        case .Orders:
            print("Show Orders")
            getMyOrders()
        case .Logout:
            print("Show Logout")
        }
    }
    
    func animateStatusBar() {
        UIView.animate(withDuration: 0.5, delay: 0, usingSpringWithDamping: 0.8, initialSpringVelocity: 0,
                       options: .curveEaseOut, animations: {
            self.setNeedsStatusBarAppearanceUpdate()
        }, completion: nil)
    }
    
    // MARK: - REST calls
    
    // REST request to get events to be passed to next view controller
    func getMyEvents() {
        let urlString = "http://10.0.0.207:3001/student/ownEvents?id=" + studentId
        
        if let url = URL.init(string: urlString) {
        var req = URLRequest.init(url: url)
            req.httpMethod = "GET"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            req.setValue("Bearer " + lResp.token, forHTTPHeaderField: "Authorization")
            
            let task = URLSession.shared.dataTask(with: req,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
                    let eResp = try? JSONDecoder().decode(myEventsResp.self, from: data!)
                    self.evResp = eResp!
                    self.eventsArray.removeAll()
                    
                    // Loop through list of events and create array of GOEvent objects
                    for event in self.evResp.events {
                        let tempEvent = GOEvent(image: event.images[0],
                                                title: event.event.name,
                                                points: event.event.points,
                                                description: event.description,
                                                status: event.status,
                                                date: event.createdDate)
                        self.eventsArray.append(tempEvent)
                        print("Filling events array with ", tempEvent.title)
                    }
                    
                    DispatchQueue.main.async {
                        print("Presenting controller with events ", self.eventsArray.count)
                        let controller = EventsController()
                        // Can pass variables from here to controller using controller.variable
                        controller.eventsArray = self.eventsArray
                        self.present(UINavigationController(rootViewController: controller), animated: true, completion: nil)
                    }
            })
            task.resume()
        }
    }
    
    // REST request to get orders to be passed to next view controller
    func getMyOrders() {
        let urlString = "http://10.0.0.207:3001/student/ownOrders?id=" + studentId
        
        if let url = URL.init(string: urlString) {
        var req = URLRequest.init(url: url)
            req.httpMethod = "GET"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            req.setValue("Bearer " + lResp.token, forHTTPHeaderField: "Authorization")
            
            let task = URLSession.shared.dataTask(with: req,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
                    let oResp = try? JSONDecoder().decode(myOrdersResp.self, from: data!)
                    self.orResp = oResp!
                    self.ordersArray.removeAll()
                    
                    // Loop through list of events and create array of GOEvent objects
                    for order in self.orResp.orders {
                        // Will only pick the first item in the order for now
                        let tempOrder = GOOrder(image: order.items[0].item.images[0],
                                                name: order.items[0].item.name,
                                                points: order.points,
                                                size: order.items[0].size,
                                                status: order.status,
                                                date: order.createdDate)
                        self.ordersArray.append(tempOrder)
                        print("Filling events array with ", tempOrder.name)
                    }
                    
                    DispatchQueue.main.async {
                        print("Presenting controller with events ", self.ordersArray.count)
                        let controller = OrdersController()
                        // Can pass variables from here to controller using controller.variable
                        controller.ordersArray = self.ordersArray
                        self.present(UINavigationController(rootViewController: controller), animated: true, completion: nil)
                    }
            })
            task.resume()
        }
    }
    
}

extension NavContainerViewController: HomeContollerDelegate {
    func handleMenuToggle(forMenuOption menuOption: MenuOption?) {
        print("Delegate handling menu toggle for ", menuOption.debugDescription)
        if !isExpanded {
            configureMenuController()
        }
        
        isExpanded = !isExpanded
        animatePanel(shouldExpand: isExpanded, menuOption: menuOption)
    }
} 
