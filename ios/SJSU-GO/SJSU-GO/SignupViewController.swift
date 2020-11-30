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
    var id : String
    var fname : String?
    var lname : String?
    var email : String?
    var password : String?
    var major : String?
    var year : String?
    var imageName : String?
}

struct IDResp : Codable {
    var imageName: String?
}

class SignupViewController: UIViewController {

    @IBOutlet weak var idTF: UITextField!
    @IBOutlet weak var fNameTF: UITextField!
    @IBOutlet weak var lNameTF: UITextField!
    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var majorTF: UITextField!
    @IBOutlet weak var yearTF: UITextField!
    
    var selectedImage: String!
    var imagePickController: UIImagePickerController?
    
    var userData: UserReg!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
    
    // REST request for signing up
    func restSignup() {
        let data = self.userData!
        print("Signing up with " + data.id + " and " + data.password!)
        let urlString = "http://10.0.0.207:8080/user/signup"
    
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

                    DispatchQueue.main.async {
                        // If sucessful, redirect to login
                        self.loadNextScreen()
                    }
            })
            task.resume()
        }
    }
    
    func loadNextScreen() {
        self.performSegue(withIdentifier: "signedup", sender: SignupViewController.self)

    }
    
    func sendFile(
        urlPath:String,
        fileName:String,
        data:Data){
        
        print("Inside sendFile")

        let url: URL = URL(string: urlPath)!
        var uploadReq: URLRequest = URLRequest(url: url as URL)

        uploadReq.httpMethod = "POST"

        let boundary = "Boundary-\(UUID().uuidString)"
        let fullData = photoDataToFormData(data: data,boundary:boundary,fileName:fileName)

        uploadReq.setValue("multipart/form-data; boundary=" + boundary,
                forHTTPHeaderField: "Content-Type")

        uploadReq.setValue(String(fullData.count), forHTTPHeaderField: "Content-Length")
        
        uploadReq.httpBody = fullData as Data
        uploadReq.httpShouldHandleCookies = false

        let _:OperationQueue = OperationQueue()

        let session = URLSession.shared
        let task = session.dataTask(with: uploadReq as URLRequest) { (data, response, error) in
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
                    
                    let uResp = try? JSONDecoder().decode(IDResp.self, from: data)
                    self.userData.imageName = uResp?.imageName ?? "defaultUser.jpg"
                    self.restSignup()
                }
            }
        }
        task.resume()
    }

    // this is a very verbose version of that function
    // you can shorten it, but i left it as-is for clarity
    // and as an example
    func photoDataToFormData(data:Data,boundary:String,fileName:String) -> Data {
        
        print("Getting photo data")
        
        var fullData = Data()

        // 1 - Boundary should start with --
        let lineOne = "--" + boundary + "\r\n"
        fullData.append(lineOne.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 2
        var lineTwo = "Content-Disposition: form-data; name=\"image\"; filename=\"" + fileName + "\"\r\n"
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
        
        // Adding ID
        
        // 1 - Boundary should start with --
        fullData.append(lineOne.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 2
        lineTwo = "Content-Disposition: form-data; name=\"id\"; value=\"" + self.userData.id + "\"\r\n"
        NSLog(lineTwo)
        fullData.append(lineTwo.data(
                                using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 3
        fullData.append(lineThree.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        /*
        let lineValue = "value=\"" + self.userData.id
        fullData.append(lineValue.data(
                                using: String.Encoding.utf8,
                            allowLossyConversion: false)!)*/

        // 5
        fullData.append(lineFive.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        // 6 - The end. Notice -- at the start and at the end
        fullData.append(lineSix.data(
                            using: String.Encoding.utf8,
            allowLossyConversion: false)!)

        return fullData
    }

    
    func uploadImage() {
        print("Trying to upload image")
        let url = "http://10.0.0.207:8080/upload/sjsuIdImage"
        print(self.selectedImage ?? "No image")
        guard let img = UIImage(contentsOfFile: self.selectedImage) else { print("No image here"); return }
        let data: Data = img.jpegData(compressionQuality: 1)!

        print("Calling sendFile")
        sendFile(urlPath: url,
            fileName:"sjsuId.jpg",
            data:data)
    }
    
    func presentImagePicker(controller: UIImagePickerController, source: UIImagePickerController.SourceType) {
        controller.delegate = self
        controller.sourceType = source
        self.present(controller, animated: true)
    }
    
    // MARK: - Button clicks
    
    @IBAction func attachSJSUId(_ sender: Any) {
        print("Clicked upload ID")
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
    
    @IBAction func attemptSignUp(_ sender: Any) {
        print("Clicked sign up")
        // Make HTTP call to add new student
        self.userData = UserReg(id: idTF.text ?? "999999999",
                              fname: fNameTF.text,
                              lname: lNameTF.text,
                              email: emailTF.text,
                              password: passwordTF.text,
                              major: majorTF.text,
                              year: yearTF.text,
                              imageName: "")
        uploadImage()
    }
    
}

// Image picker required to get submit SJSU ID for signup form
extension SignupViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
        /*guard let image = info[UIImagePickerController.InfoKey.originalImage] as? UIImage else {
            return self.imagePickerControllerDidCancel(picker)
        }*/
        print("Image has been picked")
        if let imageURL = info[UIImagePickerController.InfoKey.imageURL] as? URL {
            print(imageURL.path)
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

extension Data {
  mutating func append(string: String) {
    let data = string.data(
        using: String.Encoding.utf8,
        allowLossyConversion: true)
    append(data!)
  }
}
