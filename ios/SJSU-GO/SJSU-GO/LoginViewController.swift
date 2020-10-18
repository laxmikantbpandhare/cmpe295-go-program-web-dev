//
//  LoginViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

// Login Request
struct Cred : Codable {
    var id : String?
    var password : String?
}

// Login Response
struct LoginResponse : Codable {
    let message: String
    let user: User
    let token: String
}

struct User : Codable {
    let id: String
    let fname: String
    let lname: String
    let email: String
    let major: String
    let year: String
}

// Events reponse
struct Event : Codable {
    let _id: String
    let name: String
    let points: String
}

struct EventsList : Codable {
    let success: Bool
    let events: [Event]
}

class LoginViewController: UIViewController {
    
    @IBOutlet weak var uID: UITextField!
    @IBOutlet weak var pwd: UITextField!
    @IBOutlet weak var btn: UIButton!
    var logResp: LoginResponse!
    var evResp: EventsList!
    
    // Can also drag and drop functions for text field value changes
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    // Button pressed
    @IBAction func attemptLogin(_ sender: Any) {
        // Make HTTP call to login
        // If sucessful, redirect to main page
        
        let cred = Cred(id: uID.text, password: pwd.text)
        restLogin(cred: cred)
    }
    
    // REST request for logging in
    func restLogin(cred: Cred) {
        print("Signing in with " + cred.id! + " and " + cred.password!)
        let urlString = "http://10.0.0.207:3001/user/login"
    
        if let url = URL.init(string: urlString) {
            var req = URLRequest.init(url: url)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            
            let jsonEncoder = JSONEncoder()
            do {
                let jsonData = try jsonEncoder.encode(cred)
                let jsonString = String(data:jsonData, encoding: .utf8)
                req.httpBody   = jsonData
                print("JSON String : " + jsonString!)
            } catch {
                
            }
            
            let task = URLSession.shared.dataTask(with: req,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
                    let lResp = try? JSONDecoder().decode(LoginResponse.self, from: data!)
                    // If lResp is null, login failed.
                    // Don't crash, show error to the user
                    self.logResp = lResp!
                    self.getActiveEvents()
            })
            task.resume()
        }
    }
    
    // REST request to get active events to be passed to next view controller
    func getActiveEvents() {
        let urlString = "http://10.0.0.207:3001/admin/ActiveEvents"
        
        if let url = URL.init(string: urlString) {
        var req = URLRequest.init(url: url)
            req.httpMethod = "GET"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            req.setValue("Bearer " + logResp.token, forHTTPHeaderField: "Authorization")
            
            let task = URLSession.shared.dataTask(with: req,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
                    let eResp = try? JSONDecoder().decode(EventsList.self, from: data!)
                    self.evResp = eResp!
                    DispatchQueue.main.async {
                        self.loadNextScreen()
                    }
            })
            task.resume()
        }
    }
    
    // MARK: - Navigation
    
    func loadNextScreen() {
        //self.performSegue(withIdentifier: "loggedin", sender: LoginViewController.self)
        self.performSegue(withIdentifier: "container", sender: LoginViewController.self)

    }

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
        //let mainVC = segue.destination as! MainViewController
        //let mainVC = segue.destination as! ContainerViewController

        //mainVC.lResp = self.logResp
        //mainVC.evList = self.evResp
    }

}
