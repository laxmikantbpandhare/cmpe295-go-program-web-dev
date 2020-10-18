//
//  ViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

// Splash screen from where the user gets the option to either login or signup
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func signingUp(_ sender: Any) {
        // Segue to SignupViewController
        performSegue(withIdentifier: "signup", sender: self)
    }
    @IBAction func loggingIn(_ sender: Any) {
        // Segue to LoginViewController
        performSegue(withIdentifier: "login", sender: self)
    }
    
}

