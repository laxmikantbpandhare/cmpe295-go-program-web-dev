//
//  SignupViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class SignupViewController: UIViewController {

    @IBOutlet weak var passwordTF: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    @IBAction func attemptSignup(_ sender: Any) {
        // Make HTTP call to add new student
        // If sucessful, redirect to login
        performSegue(withIdentifier: "signedup", sender: self)
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
