//
//  SignupViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

// Login Request
struct UserReg : Codable {
    var id : String?
    var fName : String?
    var lName : String?
    var email : String?
    var password : String?
    var major : String?
    var year : String?
    var image : String?
}

class SignupViewController: UIViewController {

    @IBOutlet weak var idTF: UITextField!
    @IBOutlet weak var fNameTF: UITextField!
    @IBOutlet weak var lNameTF: UITextField!
    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var majorTF: UITextField!
    @IBOutlet weak var yearTF: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    @IBAction func attemptSignup(_ sender: Any) {
        // Make HTTP call to add new student
        let userReg = UserReg(id: idTF.text,
                              fName: fNameTF.text,
                              lName: lNameTF.text,
                              email: emailTF.text,
                              password: passwordTF.text,
                              major: majorTF.text,
                              year: yearTF.text,
                              image: "")
        restSignup(data: userReg)
        
        // If sucessful, redirect to login
        performSegue(withIdentifier: "signedup", sender: self)
    }
    
    // REST request for signing up
    func restSignup(data: UserReg) {
        print("Signing up with " + data.id! + " and " + data.password!)
        let urlString = "http://10.0.0.207:3001/user/signup"
    
        if let url = URL.init(string: urlString) {
            var req = URLRequest.init(url: url)
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            
            let jsonEncoder = JSONEncoder()
            do {
                let jsonData = try jsonEncoder.encode(data)
                let jsonString = String(data:jsonData, encoding: .utf8)
                req.httpBody   = jsonData
                print("JSON String : " + jsonString!)
            } catch {
                
            }
            
            let task = URLSession.shared.dataTask(with: req,
                completionHandler: { (data, response, error) in
                    print(String.init(data: data!, encoding: .ascii) ??
                    "no data")
                    //let lResp = try? JSONDecoder().decode(LoginResponse.self, from: data!)
                    // If lResp is null, login failed.
                    // Don't crash, show error to the user
                    //self.logResp = lResp!
                    //self.getActiveEvents()
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
