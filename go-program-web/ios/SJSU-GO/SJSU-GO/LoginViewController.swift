//
//  LoginViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    @IBAction func attemptLogin(_ sender: Any) {
        // Make HTTP call to login
        // If sucessful, redirect to main page
        //let success = restLogin()
        performSegue(withIdentifier: "loggedin", sender: self)
    }
    
    func restLogin() {
        let urlString = "http://10.0.0.89:3001/user/login"
        
        if let url = URL.init(string: urlString) {
            let task = URLSession.shared.dataTask(with: url,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
            })
            task.resume()
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
