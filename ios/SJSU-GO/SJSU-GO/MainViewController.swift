//
//  MainViewController.swift
//  SJSU-GO
//
//  Created by prkarve on 5/6/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit
import Alamofire

//class Events {
//    static func getEvents() {
//        let urlString = "http://10.0.0.89:3001/user/login"
//    }
//}

// TableView Cell
class CellClass: UITableViewCell {
    
}

// Submit event request
struct EventObj : Codable {
    var id: String?
}

struct EventReq : Codable {
    var description: String?
    var completedDate: String?
    var student: User?
    var event: EventObj?
    var images: [String]?
}

class MainViewController: UIViewController {
    
    //  MARK: - Properties
    
    var menuController: NavMenuController!
    var centralController: UIViewController!
    var isExpanded = false
    var lResp: LoginResponse!
    var evList: EventsList!
    
    @IBOutlet weak var selEventBtn: UIButton!
    let transparentView = UIView()
    let tableView = UITableView()
    var selectedBtn = UIButton()
    var selectedRow = 0
    var datasource = [String]()
    
    @IBOutlet weak var imageBtn: UIButton!
    @IBOutlet weak var dateTxtFld: UITextField!
    @IBOutlet weak var descTxtFld: UITextField!
    
    var selectedImage: UIImage?
    var imagePickController: UIImagePickerController?
    
    //  MARK: - Init

    override func viewDidLoad() {
        super.viewDidLoad()
        print("Token is " + lResp.token + " for student " + lResp.user.fname)
        print("Number of active events is " + String(evList.events.count))
        
        // Make datasource from events list with String representations
        for event in evList.events {
            self.datasource.append(event.points + " points - " + event.name)
        }
        
        tableView.delegate = self
        tableView.dataSource = self
        tableView.register(CellClass.self, forCellReuseIdentifier: "Cell")
        
        let datePicker = UIDatePicker()
        datePicker.datePickerMode = UIDatePicker.Mode.date
        datePicker.addTarget(self, action: #selector(MainViewController.datePickerValueChanged(sender:)), for: UIControl.Event.valueChanged)
        dateTxtFld.inputView = datePicker
        
        //configureDashbaordController()
        // Do any additional setup after loading the view.
    }
    
    override var preferredStatusBarUpdateAnimation: UIStatusBarAnimation {
        return .slide
    }
    
    override var prefersStatusBarHidden: Bool {
        return isExpanded
    }
    
    // MARK: - Dropdown View
    
    func addTransparentView(frame: CGRect) {
        let window = UIApplication.shared.keyWindow
        transparentView.frame = window?.frame ?? self.view.frame
        self.view.addSubview(transparentView)
        
        tableView.frame = CGRect(x: frame.origin.x, y: frame.origin.y + frame.height, width: frame.width, height: 0)
        self.view.addSubview(tableView)
        //tableView.layer.cornerRadius = 5
        
        transparentView.backgroundColor = UIColor.black.withAlphaComponent(0.9)
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(removeTransparentView))
        transparentView.addGestureRecognizer(tapGesture)
        transparentView.alpha = 0
        UIView.animate(withDuration: 0.4, delay: 0.0, usingSpringWithDamping: 1.0, initialSpringVelocity: 1.0, options: .curveEaseInOut, animations:  {
            self.transparentView.alpha = 0.5
            self.tableView.frame = CGRect(x: frame.origin.x, y: frame.origin.y + frame.height + 5, width: frame.width, height: CGFloat(self.datasource.count * 50))
        }, completion: nil)
    }
    
    @objc func removeTransparentView() {
        let frame = selectedBtn.frame
        UIView.animate(withDuration: 0.4, delay: 0.0, usingSpringWithDamping: 1.0, initialSpringVelocity: 1.0, options: .curveEaseInOut, animations:  {
            self.transparentView.alpha = 0
            self.tableView.frame = CGRect(x: frame.origin.x, y: frame.origin.y + frame.height, width: frame.width, height: 0)
        }, completion: nil)
    }
    
    @objc func datePickerValueChanged(sender: UIDatePicker) {
        let formatter = DateFormatter()
        formatter.dateStyle = DateFormatter.Style.medium
        formatter.timeStyle = DateFormatter.Style.none
        dateTxtFld.text = formatter.string(from: sender.date)
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        view.endEditing(true)
    }
    
    func uploadFile() {
        
        let url = "http://10.0.0.92:3001/upload/images"
        
        let headers: HTTPHeaders = [
            "Authorization": "Bearer " + self.lResp.token,
            "Content-type": "multipart/form-data"
        ]
        
        AF.upload(multipartFormData: { (multipartFormData) in

        guard let imgData = self.selectedImage?.jpegData(compressionQuality: 1) else { return }
        multipartFormData.append(imgData, withName: "image", mimeType: "application/jpg")


        },to: url, usingThreshold: UInt64.init(),
          method: .post,
          headers: headers).response{ response in

            if((response.error != nil)){
                do{
                    if let jsonData = response.data{
                        let parsedData = try JSONSerialization.jsonObject(with: jsonData) as! Dictionary<String, AnyObject>
                        print(parsedData)

                        //let status = parsedData[Message.Status] as? NSInteger ?? 0
//
//                        if (status == 1){
//                            if let jsonArray = parsedData["data"] as? [[String: Any]] {
//                                withblock(jsonArray as AnyObject)
//                            }
//
//                        }else if (status == 2){
//                            print("error message")
//                        }else{
//                            print("error message")
//                        }
                    }
                } catch {
                    print("error message")
                }
            } else {
                print(response.description)
            }
        }
    }

    /*
    // MARK: - Button clicks

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
    @IBAction func attemptSubmission(_ sender: Any) {
        print("Selected event is " + evList.events[selectedRow].name)
        
        // Date formatting
        let dateFormatterSend = DateFormatter()
        dateFormatterSend.dateFormat = "yyyy-MM-dd"

        let dateFormatterPick = DateFormatter()
        dateFormatterPick.dateFormat = "MMM dd,yyyy"

        let date: NSDate? = dateFormatterPick.date(from: dateTxtFld.text!) as NSDate?
        let dateString = dateFormatterSend.string(from: date! as Date)
        
        // Event object
        let eObj = EventObj(id: evList.events[selectedRow]._id)
        
        // Get image URL
        //uploadFile()
        
        let eReq = EventReq(description: descTxtFld.text, completedDate: dateString, student: lResp.user, event: eObj, images: ["https://twitter-prototype-project.s3.us-west-1.amazonaws.com/sjsu_go%3A1589776627423.png"])
        
        let urlString = "http://10.0.0.207:3001/student/createEvent"
        
            if let url = URL.init(string: urlString) {
                var req = URLRequest.init(url: url)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.setValue("application/json", forHTTPHeaderField: "Accept")
                req.setValue("Bearer " + lResp.token, forHTTPHeaderField: "Authorization")
                
                let jsonEncoder = JSONEncoder()
                do {
                    let jsonData = try jsonEncoder.encode(eReq)
                    let jsonString = String(data:jsonData, encoding: .utf8)
                    req.httpBody   = jsonData
                    print("JSON String : " + jsonString!)
                } catch {
                    
                }
                
                let task = URLSession.shared.dataTask(with: req,
                    completionHandler: { (data, response, error) in
                        print(String.init(data: data!, encoding: .ascii) ??
                        "no data")
                        DispatchQueue.main.async {
                            self.performSegue(withIdentifier: "doneSubmission", sender: MainViewController.self)
                        }
                })
                task.resume()
            }
        
    }
    
    @IBAction func onSelectEventClick(_ sender: Any) {
        selectedBtn = selEventBtn
        addTransparentView(frame: selEventBtn.frame)
    }
    
    @IBAction func onAttachButtonClick(_ sender: Any) {
        
        if self.imagePickController != nil {
            self.imagePickController?.delegate = nil
            self.imagePickController = nil
        }
        
        self.imagePickController = UIImagePickerController.init()
        
        let alert = UIAlertController.init(title: "Select Source Type", message: nil, preferredStyle: .actionSheet)
        
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            alert.addAction(UIAlertAction.init(title: "Camera", style: .default, handler: { (_) in
                self.presentImagePicker(controller: self.imagePickController!, source: .camera)
            }))
        }
        
        if UIImagePickerController.isSourceTypeAvailable(.photoLibrary) {
            alert.addAction(UIAlertAction.init(title: "Photo Library", style: .default, handler: { (_) in
                self.presentImagePicker(controller: self.imagePickController!, source: .photoLibrary)
            }))
        }
        
        if UIImagePickerController.isSourceTypeAvailable(.savedPhotosAlbum) {
            alert.addAction(UIAlertAction.init(title: "Saved Albums", style: .default, handler: { (_) in
                self.presentImagePicker(controller: self.imagePickController!, source: .savedPhotosAlbum)
            }))
        }
        
        alert.addAction(UIAlertAction.init(title: "Cancel", style: .cancel))
        
        self.present(alert, animated: true)
    }
    
    func presentImagePicker(controller: UIImagePickerController, source: UIImagePickerController.SourceType) {
        controller.delegate = self
        controller.sourceType = source
        self.present(controller, animated: true)
    }
    
}

// MARK: - Extensions

// Image picker required to get submit image for events form
extension MainViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        guard let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage else {
            return self.imagePickerControllerDidCancel(picker)
        }
        
        self.selectedImage = image
        picker.dismiss(animated: true, completion: {
            picker.delegate = nil
            self.imagePickController = nil
        })
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: {
            picker.delegate = nil
            self.imagePickController = nil
        })
    }
}

extension MainViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.datasource.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        cell.textLabel?.text = self.datasource[indexPath.row]
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 50
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selectedBtn.setTitle(self.datasource[indexPath.row], for: .normal)
        self.selectedRow = indexPath.row
        removeTransparentView()
    }
}
