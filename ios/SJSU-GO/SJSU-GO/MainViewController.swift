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

struct UploadResp : Codable {
    var imagesName: [String]?
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
    
    var dateString = ""
    var descString = ""
    
    @IBOutlet weak var imageBtn: UIButton!
    @IBOutlet weak var dateTxtFld: UITextField!
    @IBOutlet weak var descTxtFld: UITextField!
    
    var selectedImage: String!
    var imagePickController: UIImagePickerController?
    
    //  MARK: - Init

    override func viewDidLoad() {
        super.viewDidLoad()
        print("Token is " + lResp.token)
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
    
    func sendFile(
        urlPath:String,
        fileName:String,
        data:Data){
        
        print("Inside sendFile")

        let url: URL = URL(string: urlPath)!
        var request1: URLRequest = URLRequest(url: url as URL)

        request1.httpMethod = "POST"

        let boundary = "Boundary-\(UUID().uuidString)"
        let fullData = photoDataToFormData(data: data,boundary:boundary,fileName:fileName)

            request1.setValue("multipart/form-data; boundary=" + boundary,
                forHTTPHeaderField: "Content-Type")
//        request1.setValue("application/json", forHTTPHeaderField: "Content-Type")
 //       request1.setValue("application/json", forHTTPHeaderField: "Accept")
        request1.setValue("Bearer " + lResp.token, forHTTPHeaderField: "Authorization")

            // REQUIRED!
            request1.setValue(String(fullData.length), forHTTPHeaderField: "Content-Length")

        request1.httpBody = fullData as Data
        request1.httpShouldHandleCookies = false

        let _:OperationQueue = OperationQueue()

        let session = URLSession.shared
        let task = session.dataTask(with: request1 as URLRequest) { (data, response, error) in
            guard let data = data, error == nil else {
                // check for fundamental networking error
                print("error=\(String(describing: error))")
                //self.showAlertMessage(title: "App name", message: "Server not responding, please try later")
                return
            }
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode != 200 {
                // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(String(describing: response))")
                //self.delegate?.internetConnectionFailedIssue()
            }else{
                do {
                    print("I guess we got a response 200")
                    
                    print(String.init(data: data, encoding: .ascii) ??
                    "no data")
                    
                    let uResp = try? JSONDecoder().decode(UploadResp.self, from: data)
                    self.postEvent(image: uResp?.imagesName?[0] ?? "default.jpg")
                }
            }
        }
        task.resume()
    }

    // this is a very verbose version of that function
    // you can shorten it, but i left it as-is for clarity
    // and as an example
    func photoDataToFormData(data:Data,boundary:String,fileName:String) -> NSData {
        
        print("Getting photo data")
        
        let fullData = NSMutableData()

        // 1 - Boundary should start with --
        let lineOne = "--" + boundary + "\r\n"
        fullData.append(lineOne.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 2
        let lineTwo = "Content-Disposition: form-data; name=\"image\"; filename=\"" + fileName + "\"\r\n"
        NSLog(lineTwo)
        fullData.append(lineTwo.data(
                                using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 3
        let lineThree = "Content-Type: image/jpg\r\n\r\n"
        fullData.append(lineThree.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 4
        fullData.append(data)

        // 5
        let lineFive = "\r\n"
        fullData.append(lineFive.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 6 - The end. Notice -- at the start and at the end
        let lineSix = "--" + boundary + "--\r\n"
        fullData.append(lineSix.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        return fullData
    }

    
    func uploadImage() {
        print("Trying to upload image")
        let url = "http://10.0.0.207:3001/upload/images"
        print(self.selectedImage ?? "No image")
        guard let img = UIImage(contentsOfFile: self.selectedImage) else { print("No image here"); return }
        let data: Data = img.jpegData(compressionQuality: 1)!

        print("Calling sendFile")
        sendFile(urlPath: url,
            fileName:"event.jpg",
            data:data)
    }
    
    func postEvent(image: String) {
        
        // Event object
        let eObj = EventObj(id: self.evList.events[self.selectedRow]._id)
        
        let eReq = EventReq(description: self.descString, completedDate: self.dateString, student: self.lResp.user, event: eObj, images: [image])
        
        let urlString = "http://10.0.0.207:3001/student/createEvent"
        
            if let url = URL.init(string: urlString) {
                var req = URLRequest.init(url: url)
                req.httpMethod = "POST"
                req.setValue("application/json", forHTTPHeaderField: "Content-Type")
                req.setValue("application/json", forHTTPHeaderField: "Accept")
                req.setValue("Bearer " + self.lResp.token, forHTTPHeaderField: "Authorization")
                
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
                            //self.view.window?.rootViewController?.dismiss(animated: true, completion: nil)
                            guard let vc = self.presentingViewController else { return }
                            vc.dismiss(animated: true, completion: nil)
                        }
                })
                task.resume()
            }
    }
    
    func formatDate() {
        // Date formatting
        let dateFormatterSend = DateFormatter()
        dateFormatterSend.dateFormat = "yyyy-MM-dd"

        let dateFormatterPick = DateFormatter()
        dateFormatterPick.dateFormat = "MMM dd,yyyy"

        let date: NSDate? = dateFormatterPick.date(from: self.dateTxtFld.text!) as NSDate?
        self.dateString = dateFormatterSend.string(from: date! as Date)
    }

    // MARK: - Button clicks
    
    @IBAction func attemptSubmission(_ sender: Any) {
        print("Selected event is " + evList.events[selectedRow].name)
        
        // Read description from text field
        self.descString = self.descTxtFld.text ?? "None"
        
        // Read date and format it
        formatDate()
        
        // Upload image and submit event
        uploadImage()
        
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
        /*guard let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage else {
            return self.imagePickerControllerDidCancel(picker)
        }*/
        print("Image has been picked")
        if let imageURL = info[UIImagePickerController.InfoKey.imageURL] as? URL {
            print(imageURL.path)
            print(imageURL)
            self.selectedImage = imageURL.path
        }
        
        //self.selectedImage = image
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
