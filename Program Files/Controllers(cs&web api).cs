using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NGLConnect.Controllers
{
    public class CustomerController : BaseController
    {
        // GET:  Customer
        public ActionResult Customer()
        {
            return PartialView("Customer");
        }
       public ActionResult CustServices()
        {
            return PartialView("CustServices");
        }
public ActionResult CustSpecialInstructions()
        {
            return PartialView("CustSpecialInstructions");
        }
         }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace NGLConnect.WebAPIController
{
    public class CourierController : ApiController
    {
        ServiceConnector objServiceConnector = new ServiceConnector();
        string ErrorMsg = string.Empty;
       

        [Route("api/Courier/GetCourierSvcAreaDetails")]
        [HttpPost]
        [ResponseType(typeof(string))]
        public HttpResponseMessage GetCourierSvcAreaDetails(HttpRequestMessage request, string RequestText)
        {
            if (HttpContext.Current.Session["UserDtl"] != null)
            {
                string searchList = CommonFunction.DecryptStringAES(RequestText);
                string Response = objServiceConnector.CallService(ServiceList.MasterService, ServiceList.CourierService.ToString(), "GetCourierSvcAreaDetails", searchList, out ErrorMsg);
                if (string.IsNullOrEmpty(ErrorMsg))
                {
                    return request.CreateResponse(System.Net.HttpStatusCode.OK, Response);
                }
                else
                {
                    return request.CreateResponse(System.Net.HttpStatusCode.Accepted, ErrorMsg);
                }
            }
            else
            {
                HttpContext.Current.Response.Redirect("~/login");
                return request.CreateResponse(System.Net.HttpStatusCode.Accepted, "");
            }
        }

        [Route("api/Courier/TransCouriersvcAreaDetails")]
        [HttpPost]
        [ResponseType(typeof(string))]
        public HttpResponseMessage TransCouriersvcAreaDetails(HttpRequestMessage request, string RequestText)
        {
            if (HttpContext.Current.Session["UserDtl"] != null)
            {
                string searchList = CommonFunction.DecryptStringAES(RequestText);
                string Response = objServiceConnector.CallService(ServiceList.MasterService, ServiceList.CourierService.ToString(), "TransCouriersvcAreaDetails", searchList, out ErrorMsg);
                if (string.IsNullOrEmpty(ErrorMsg))
                {
                    return request.CreateResponse(System.Net.HttpStatusCode.OK, Response);
                }
                else
                {
                    return request.CreateResponse(System.Net.HttpStatusCode.Accepted, ErrorMsg);
                }
            }
            else
            {
                HttpContext.Current.Response.Redirect("~/login");
                return request.CreateResponse(System.Net.HttpStatusCode.Accepted, "");
            }
        }

 
        

    }
}
---------------------Open File UrL------------------
[Route("api/General/OpenFileURL")]
        [HttpPost]
        [ResponseType(typeof(string))]
        public HttpResponseMessage OpenFileURL(HttpRequestMessage request, string docPath)
        {

            string decrypDocPath = CommonFunction.DecryptStringAES(docPath);
            string uploadPath = Convert.ToString(HttpContext.Current.Session["DownloadPath"]);
            string Response = uploadPath + decrypDocPath;
            Response = Response.Replace("\"", "");
            if (!string.IsNullOrEmpty(Response))
            {
                return request.CreateResponse(System.Net.HttpStatusCode.OK, Response);
            }
            else
            {
                return request.CreateResponse(System.Net.HttpStatusCode.Accepted, ErrorMsg);
            }
        }

