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
    var evResp: EventsList!
    @IBOutlet weak var submitBtn: UIButton!
    
    //  MARK: - Init
    
    override func viewDidLoad() {
        super.viewDidLoad()
        configureNavigationBar()
        configureButtons()
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
    
    @objc func pressed() {
        print("Button pressed")
        getActiveEvents()
    }
    
    func loadNextScreen() {
        //let submissionController = MainViewController()
        
        let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let submissionController = storyBoard.instantiateViewController(withIdentifier: "MainViewController") as! MainViewController
        submissionController.lResp = self.lResp
        submissionController.evList = self.evResp
        present(submissionController, animated: true, completion: nil)
        //present(UINavigationController(rootViewController: submissionController), animated: true, )
    }
    
    func configureButtons() {
        print("Laying out buttons..")
        let myFirstButton = UIButton(frame: CGRect(x: 100, y: 400, width: 200, height: 50))
        myFirstButton.setTitle("Submit event", for: .normal)
        myFirstButton.setTitleColor(UIColor.blue, for: .normal)
        myFirstButton.addTarget(self, action: #selector(self.pressed), for: .touchUpInside)
        self.view.addSubview(myFirstButton)
    }
    
    @IBAction func attemptSubmission(_ sender: Any) {
        print("Token is " + lResp.token + " for student " + lResp.user.fname)
    }
    
    // MARK: - REST calls
    
    // REST request to get active events to be passed to next view controller
    func getActiveEvents() {
        let urlString = "http://10.0.0.207:3001/admin/ActiveEvents"
        
        if let url = URL.init(string: urlString) {
        var req = URLRequest.init(url: url)
            req.httpMethod = "GET"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.setValue("application/json", forHTTPHeaderField: "Accept")
            req.setValue("Bearer " + lResp.token, forHTTPHeaderField: "Authorization")
            
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
}
