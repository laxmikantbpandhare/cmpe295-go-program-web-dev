//
//  UIViewExt.swift
//  SJSU-GO
//
//  Created by Karve, Prathamesh on 10/18/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

extension UIView {
    func pin(to superView: UIView) {
        translatesAutoresizingMaskIntoConstraints = false
        trailingAnchor.constraint(equalTo: superView.trailingAnchor).isActive = true
        leadingAnchor.constraint(equalTo: superView.leadingAnchor).isActive = true
        topAnchor.constraint(equalTo: superView.topAnchor).isActive = true
        bottomAnchor.constraint(equalTo: superView.bottomAnchor).isActive = true

    }
}
