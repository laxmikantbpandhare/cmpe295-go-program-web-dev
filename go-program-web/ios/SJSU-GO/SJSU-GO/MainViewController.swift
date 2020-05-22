//
//  MainViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

//class Events {
//    static func getEvents() {
//        let urlString = "http://10.0.0.89:3001/user/login"
//    }
//}

class MainViewController: UIViewController {
    
    //  MARK: - Properties
    
    var menuController: UIViewController!
    var centralController: UIViewController!
    var isExpanded = false
    
    //  MARK: - Init

    override func viewDidLoad() {
        super.viewDidLoad()
        
        configureDashbaordController()
        // Do any additional setup after loading the view.
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .darkContent
    }
    
    // MARK: - Handlers
    
    func configureDashbaordController() {
        
        let dashboardController = DashboardController()
        dashboardController.delegate = self
        centralController = UINavigationController(rootViewController: dashboardController)
        
        view.addSubview(centralController.view)
        addChild(centralController)
        centralController.didMove(toParent: self)
    }
    
    func configureEventsController() {
        
        let eventsController = EventsController()
        let controller       = UINavigationController(rootViewController: eventsController)
        
        view.addSubview(controller.view)
        addChild(controller)
        controller.didMove(toParent: self)
    }
    
    func configureRedeemController() {
        
        let redeemController = ReedeemController()
        let controller       = UINavigationController(rootViewController: redeemController)
        
        view.addSubview(controller.view)
        addChild(controller)
        controller.didMove(toParent: self)
    }
    
    func configureMenuController() {
        if menuController == nil {
            // Add menu controller here
            menuController = MenuController()
            view.insertSubview(menuController.view, at: 0)
            addChild(menuController)
            menuController.didMove(toParent: self)
            print("Did add menu controller")
        }
    }
    
    func showMenuController(shouldExpand: Bool) {
        
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
            }, completion: nil)
        }
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

extension MainViewController: HomeContollerDelegate {
    
    func handleMenuToggle() {
        
        if !isExpanded {
            configureMenuController()
        }
        
        isExpanded = !isExpanded
        showMenuController(shouldExpand: isExpanded)
    }
}
