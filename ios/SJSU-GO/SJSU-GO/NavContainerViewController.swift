//
//  ContainerViewController.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 9/27/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class NavContainerViewController: UIViewController {
    
    var menuController: NavMenuController!
    var centralController: UIViewController!
    var isExpanded = false
    var lResp: LoginResponse!
    
    // MARK: - Properties
    
    // MARK: - Init
    
    override func viewDidLoad() {
        print("Inside container view controller")
        super.viewDidLoad()
        configureDashbaordController()
    }
    
    // MARK: - Handlers
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .darkContent
    }
    
    func configureDashbaordController() {
        
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
        
        let redeemController = ReedeemController()
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
            break
        case .Events:
            let controller = EventsController()
            // Can pass variables from here to controller using controller.variable
            present(UINavigationController(rootViewController: controller), animated: true, completion: nil)
            break
        case .Redeem:
            print("Show Redeem")
            break
        case .Orders:
            print("Show Orders")
            break
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
    
}

extension NavContainerViewController: HomeContollerDelegate {
    func handleMenuToggle(forMenuOption menuOption: MenuOption?) {
        if !isExpanded {
            configureMenuController()
        }
        
        isExpanded = !isExpanded
        animatePanel(shouldExpand: isExpanded, menuOption: menuOption)
    }
} 
