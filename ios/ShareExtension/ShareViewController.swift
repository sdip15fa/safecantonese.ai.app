import UIKit
import Social
import MobileCoreServices

class ShareViewController: UIViewController {
    // IMPORTANT: This should be your host app scheme
    let hostAppURLScheme = "me.wcyat.safecantoneseai"
    let urlContentType = kUTTypeURL as String
    let textContentType = kUTTypePlainText as String
    
    override func viewDidLoad() {
        
        var strUrl:String? = nil
        DispatchQueue.global().async {
            
            
            if let content = self.extensionContext!.inputItems[0] as? NSExtensionItem {
                if let contents = content.attachments {
                    for (_, attachment) in (contents).enumerated() {
                        if attachment.hasItemConformingToTypeIdentifier(self.urlContentType) {
                            let _strUrl = self.getStrUrlFromUrl(attachment: attachment)
                            if(_strUrl != nil){
                                strUrl = _strUrl
                            }
                        }
                        
                        if attachment.hasItemConformingToTypeIdentifier(self.textContentType) {
                            if(strUrl != nil){
                                continue;
                            }
                            let    _strUrl = self.getStrUrlFromText(attachment: attachment)
                            if(_strUrl != nil){
                                strUrl = _strUrl
                            }
                            
                        }
                    }
                }
            }
            
            if(strUrl == nil){
                self.dismissWithError()
                return;
            }
            self.redirectToHostApp(sharedURL: strUrl!)
        }
    }
    
    
    private func getStrUrlFromUrl ( attachment: NSItemProvider) -> String? {
        var result:String? = nil
        
        let semaphore = DispatchSemaphore(value: 0)
        
        attachment.loadItem(forTypeIdentifier: self.urlContentType, options: nil) { data, error in
            
            if error == nil, let item = data as? URL {
                let _url = URL(string: item.absoluteString)
                if(_url != nil){
                    result = item.absoluteString
                }
            }
            semaphore.signal()
        }
        
        semaphore.wait()
        
        return result
    }
    
    private func getStrUrlFromText ( attachment: NSItemProvider) -> String? {
        var result:String? = nil
        
        let semaphore = DispatchSemaphore(value: 0)
        
        attachment.loadItem(forTypeIdentifier: self.textContentType, options: nil) { data, error in
            
            if error == nil, let item = data as? String {
                
                let types: NSTextCheckingResult.CheckingType = [.link]
                let detector = try? NSDataDetector(types: types.rawValue)
                
                if  detector != nil && item.count > 0 && detector!.numberOfMatches(in: item, options: NSRegularExpression.MatchingOptions(rawValue: 0), range: NSMakeRange(0, item.count)) > 0 {
                    result = item
                }
                
            }
            semaphore.signal()
        }
        
        semaphore.wait()
        
        
        return result
    }    
    
    private func dismissWithError() {
        self.dismiss(animated: true, completion: nil)
        extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }
    
    private func redirectToHostApp(sharedURL: String) {
        var urlComponents = URLComponents()
        urlComponents.scheme = hostAppURLScheme
        urlComponents.host = "share"
        urlComponents.path = "/"
        urlComponents.queryItems = [
            URLQueryItem(name: "url", value: sharedURL),
        ]
        // urlComponents.url: (scheme)://share/?url=(sharedURL)
        let url = urlComponents.url
        var responder = self as UIResponder?
        let selectorOpenURL = sel_registerName("openURL:")
        
        while (responder != nil) {
            if (responder?.responds(to: selectorOpenURL))! {
                responder?.perform(selectorOpenURL, with: url)
            }
            responder = responder!.next
        }
        extensionContext!.completeRequest(returningItems: [], completionHandler: nil)
    }
}
