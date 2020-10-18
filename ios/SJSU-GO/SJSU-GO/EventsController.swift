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
        configureUI()

        // Do any additional setup after loading the view.
    }
    
    // MARK: - Selectors
    
    @objc func handleDismiss() {
        dismiss(animated: true, completion: nil)
    }
    
    // MARK: - Handlers
    
    func configureUI() {
        
        let cancelImage = UIImage(named: "icon_cancel")!
                
        navigationController?.navigationBar.barTintColor = .darkGray
        navigationController?.navigationBar.barStyle     = .black
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Events1"
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: cancelImage.withRenderingMode(.alwaysOriginal),
                                                    style: .plain, target: self, action: #selector(handleDismiss))

    }
    
}
