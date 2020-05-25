//
//  MenuOption.swift
//  SJSU-GO
//
//  Created by prkarve on 5/19/20.
//  Copyright © 2020 SJSU. All rights reserved.
//

import UIKit

enum MenuOption: Int, CustomStringConvertible {
    case Dashboard
    case Events
    case Redeem
    case Orders
    case Logout
    
    var description: String {
        switch self {
        case .Dashboard:
            return "Dashboard"
        case .Events:
            return "Events"
        case .Redeem:
            return "Redeem"
        case .Orders:
            return "Orders"
        case .Logout:
            return "Logout"
        }
    }
    
    var image: UIImage {
        switch self {
        case .Dashboard:
            return UIImage(named: "icon_dashboard") ?? UIImage()
        case .Events:
            return UIImage(named: "icon_events") ?? UIImage()
        case .Redeem:
            return UIImage(named: "icon_redeem") ?? UIImage()
        case .Orders:
            return UIImage(named: "icon_orders") ?? UIImage()
        case .Logout:
            return UIImage(named: "icon_lagout") ?? UIImage()
        }
    }
}
