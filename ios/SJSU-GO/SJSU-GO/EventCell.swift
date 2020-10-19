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
        
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        addSubview(eventImageView)
        addSubview(eventTitleLabel)
        // Add status to event cell
        
        configureImageView()
        configureTitleLabel()
        
        setImageConstraints()
        setTitleLabelConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func set(event: GOEvent) {
        //print("Setting cell ", event.title)
        //eventImageView.image = event.image
        eventTitleLabel.text = event.title
        
        // Do image at the end
        do {
            guard let url = URL(string: event.image) else { return }
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
        eventTitleLabel.textColor = UIColor.blue
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
        eventTitleLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        eventTitleLabel.leadingAnchor.constraint(equalTo: eventImageView.trailingAnchor, constant: 20).isActive = true
        eventTitleLabel.heightAnchor.constraint(equalToConstant: 80).isActive = true
        eventTitleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
}
