using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace TypeMeApi.Extentions
{
    public static class Helper
    {
        public  static async Task SendMessageAsync(string messageSubject, string messageBody, string mailTo)
        {
            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.UseDefaultCredentials = false;
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential("knjc621@gmail.com", "lene1234");
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            
            MailMessage message = new MailMessage("knjc621@gmail.com", mailTo);
            message.Subject = messageSubject;

            message.Body = messageBody;
            message.BodyEncoding = System.Text.Encoding.UTF8;
            message.IsBodyHtml = true;
            await client.SendMailAsync(message);
        }
        
    }
}
