//
//  OrdersController.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 10/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class OrdersController: UIViewController {
    
    //  MARK: - Properties
    
    // This delegate is required to handle menu toggling
    var delegate: HomeContollerDelegate?
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .red
        configureUI()

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
    
}

