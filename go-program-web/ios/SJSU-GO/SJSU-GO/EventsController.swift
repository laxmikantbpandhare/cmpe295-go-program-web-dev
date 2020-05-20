//
//  EventsController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class EventsController: UIViewController {
    
    //  MARK: - Properties
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .blue
        configureNavigationBar()

        // Do any additional setup after loading the view.
    }
    
    // MARK: - Handlers
    
    @objc func handleMenuToggle() {
        print("Toggle menu..")
    }
    
    func configureNavigationBar() {
        
        let menuImage = UIImage(named: "menu")!
        
        navigationController?.navigationBar.barTintColor = .darkGray
        navigationController?.navigationBar.barStyle     = .black
        
        navigationItem.title = "Slide Menu"
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: menuImage, style: .plain,
                                            target: self, action: #selector(handleMenuToggle))
    }
    
}
