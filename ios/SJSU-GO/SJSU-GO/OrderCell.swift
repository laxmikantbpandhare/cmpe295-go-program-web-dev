//
//  OrderCekk.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 10/19/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

class OrderCell: UITableViewCell{
    
    let orderImageView  = UIImageView()
    let orderTitleLabel = UILabel()
    let orderStatusLabel = UILabel()
        
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        self.backgroundColor = #colorLiteral(red: 0.1764705926, green: 0.4980392158, blue: 0.7568627596, alpha: 1)
        
        addSubview(orderImageView)
        addSubview(orderTitleLabel)
        addSubview(orderStatusLabel)
        // Add status to order cell
        
        configureImageView()
        configureTitleLabel()
        
        setImageConstraints()
        setTitleLabelConstraints()
        setStatusLabelConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func set(order: GOOrder) {
        //print("Setting cell ", order.title)
        //orderImageView.image = order.image
        orderTitleLabel.text = order.name
        orderStatusLabel.text = "Status: " + order.status
        
        // Do image at the end
        do {
            guard let url = URL(string: "http://10.0.0.207:3001/download/image/?name=" + order.image) else { return }
            let data = try Data(contentsOf: url)
            orderImageView.image = UIImage(data: data)
        }
        catch{
            print(error)
        }
    }
    
    func configureImageView() {
        orderImageView.layer.cornerRadius = 10
        orderImageView.clipsToBounds      = true
    }
    
    func configureTitleLabel() {
        orderTitleLabel.numberOfLines             = 0
        orderTitleLabel.adjustsFontSizeToFitWidth = true
        orderTitleLabel.textColor = UIColor.white
    }
    
    func setImageConstraints() {
        orderImageView.translatesAutoresizingMaskIntoConstraints = false
        orderImageView.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        orderImageView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 12).isActive = true
        orderImageView.heightAnchor.constraint(equalToConstant: 80).isActive = true
        orderImageView.widthAnchor.constraint(equalTo: orderImageView.heightAnchor, multiplier: 16/9).isActive = true
    }
    
    func setTitleLabelConstraints() {
        orderTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        orderTitleLabel.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -5).isActive = true
        orderTitleLabel.leadingAnchor.constraint(equalTo: orderImageView.trailingAnchor, constant: 20).isActive = true
        orderTitleLabel.heightAnchor.constraint(equalToConstant: 60).isActive = true
        orderTitleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
    func setStatusLabelConstraints() {
        orderStatusLabel.translatesAutoresizingMaskIntoConstraints = false
        //eventStatusLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        orderStatusLabel.topAnchor.constraint(equalTo: orderTitleLabel.bottomAnchor).isActive = true
        orderStatusLabel.leadingAnchor.constraint(equalTo: orderImageView.trailingAnchor, constant: 20).isActive = true
        orderStatusLabel.heightAnchor.constraint(equalToConstant: 80).isActive = true
        orderStatusLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
}
