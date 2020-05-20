//
//  DashboardController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class DashboardController: UIViewController {
    
    //  MARK: - Properties
    
    var delegate: HomeContollerDelegate?
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        configureNavigationBar()
        
        // Do any additional setup after loading the view.
    }
    
    // MARK: - Handlers
    
    @objc func handleMenuToggle() {
        print("Toggle menu..")
        delegate?.handleMenuToggle()
    }
    
    func configureNavigationBar() {
        
        let menuImage = UIImage(named: "menu")!
        
        navigationController?.navigationBar.barTintColor = UIColor(red: 0.97, green: 0.70, blue: 0.10, alpha: 1.00)
        navigationController?.navigationBar.barStyle     = .black
        
        navigationItem.title = "Dashboard"
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: menuImage.withRenderingMode(.alwaysOriginal), style: .plain,
                                            target: self, action: #selector(handleMenuToggle))
    }
}
