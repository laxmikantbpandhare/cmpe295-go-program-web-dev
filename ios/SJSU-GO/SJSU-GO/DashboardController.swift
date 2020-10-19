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
    
    // This delegate is required to handle menu toggling
    var delegate: HomeContollerDelegate?
    
    var lResp: LoginResponse!
    @IBOutlet weak var submitBtn: UIButton!
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        configureNavigationBar()
        view.backgroundColor = .purple
        //print("Token is " + lResp.token + " for student " + lResp.user.fname)
        
        // Do any additional setup after loading the view.
    }
    
    // MARK: - Handlers
    
    @objc func handleMenuToggle() {
        print("Toggle menu..")
        delegate?.handleMenuToggle(forMenuOption: nil)
    }
    
    func configureNavigationBar() {
        
        let menuImage = UIImage(named: "icon_menu")!
        
        navigationController?.navigationBar.barTintColor = UIColor(red: 0.97, green: 0.70, blue: 0.10, alpha: 1.00)
        navigationController?.navigationBar.barStyle     = .black
        
        navigationItem.title = "Dashboard"
        navigationItem.leftBarButtonItem = UIBarButtonItem(image: menuImage.withRenderingMode(.alwaysOriginal), style: .plain,
                                            target: self, action: #selector(handleMenuToggle))
    }
    
    @IBAction func attemptSubmission(_ sender: Any) {
        print("Token is " + lResp.token + " for student " + lResp.user.fname)
    }
}
