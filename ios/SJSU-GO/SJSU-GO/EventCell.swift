//
//  EventCell.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 10/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class EventCell: UITableViewCell{
    
    let eventImageView  = UIImageView()
    let eventTitleLabel = UILabel()
    let eventStatusLabel = UILabel()
        
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        self.backgroundColor = #colorLiteral(red: 0.1764705926, green: 0.4980392158, blue: 0.7568627596, alpha: 1)
        
        addSubview(eventImageView)
        addSubview(eventTitleLabel)
        addSubview(eventStatusLabel)
        
        configureImageView()
        configureTitleLabel()
        
        setImageConstraints()
        setTitleLabelConstraints()
        setStatusLabelConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func set(event: GOEvent) {
        //print("Setting cell ", event.title)
        //eventImageView.image = event.image
        eventTitleLabel.text  = event.title
        eventStatusLabel.text = "Status: " + event.status
        
        // Do image at the end
        do {
            guard let url = URL(string: "http://10.0.0.207:3001/download/image/?name=" + event.image) else { return }
            let data = try Data(contentsOf: url)
            eventImageView.image = UIImage(data: data)
        }
        catch{
            print(error)
        }
    }
    
    func configureImageView() {
        eventImageView.layer.cornerRadius = 10
        eventImageView.clipsToBounds      = true
    }
    
    func configureTitleLabel() {
        eventTitleLabel.numberOfLines             = 0
        eventTitleLabel.adjustsFontSizeToFitWidth = true
        eventTitleLabel.textColor = UIColor.white
    }
    
    func configureStatusLabel() {
        eventStatusLabel.numberOfLines             = 0
        eventStatusLabel.adjustsFontSizeToFitWidth = true
        eventStatusLabel.textColor = UIColor.white
    }
    
    func setImageConstraints() {
        eventImageView.translatesAutoresizingMaskIntoConstraints = false
        eventImageView.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        eventImageView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 12).isActive = true
        eventImageView.heightAnchor.constraint(equalToConstant: 80).isActive = true
        eventImageView.widthAnchor.constraint(equalTo: eventImageView.heightAnchor, multiplier: 16/9).isActive = true
    }
    
    func setTitleLabelConstraints() {
        eventTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        eventTitleLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -5).isActive = true
        eventTitleLabel.leadingAnchor.constraint(equalTo: eventImageView.trailingAnchor, constant: 20).isActive = true
        eventTitleLabel.heightAnchor.constraint(equalToConstant: 60).isActive = true
        eventTitleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
    func setStatusLabelConstraints() {
        eventStatusLabel.translatesAutoresizingMaskIntoConstraints = false
        //eventStatusLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        eventStatusLabel.topAnchor.constraint(equalTo: eventTitleLabel.bottomAnchor).isActive = true
        eventStatusLabel.leadingAnchor.constraint(equalTo: eventImageView.trailingAnchor, constant: 20).isActive = true
        eventStatusLabel.heightAnchor.constraint(equalToConstant: 80).isActive = true
        eventStatusLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
}
