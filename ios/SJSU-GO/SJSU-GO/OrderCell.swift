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
        
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        addSubview(orderImageView)
        addSubview(orderTitleLabel)
        // Add status to order cell
        
        configureImageView()
        configureTitleLabel()
        
        setImageConstraints()
        setTitleLabelConstraints()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func set(order: GOOrder) {
        //print("Setting cell ", order.title)
        //orderImageView.image = order.image
        orderTitleLabel.text = order.name
        
        // Do image at the end
        do {
            guard let url = URL(string: order.image) else { return }
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
        orderTitleLabel.textColor = UIColor.blue
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
        orderTitleLabel.centerYAnchor.constraint(equalTo: centerYAnchor).isActive = true
        orderTitleLabel.leadingAnchor.constraint(equalTo: orderImageView.trailingAnchor, constant: 20).isActive = true
        orderTitleLabel.heightAnchor.constraint(equalToConstant: 80).isActive = true
        orderTitleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -12).isActive = true
    }
    
}
