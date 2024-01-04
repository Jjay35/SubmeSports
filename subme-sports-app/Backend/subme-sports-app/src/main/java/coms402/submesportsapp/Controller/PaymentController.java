package coms402.submesportsapp.Controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData;
import coms402.submesportsapp.Model.ProductDAO;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
//import org.stripe.param.checkout.PaymentIntent;

import coms402.submesportsapp.Model.Payment;
import coms402.submesportsapp.Repository.PaymentRepository;
import coms402.submesportsapp.Model.CustomerUtil;
import coms402.submesportsapp.Model.RequestDTO;


@RestController
public class PaymentController {

    String STRIPE_API_KEY = System.getenv().get("STRIPE_API_KEY");

    @PostMapping("/checkout/hosted")
    String hostedCheckout(@RequestBody RequestDTO requestDTO) throws StripeException {

        Stripe.apiKey = STRIPE_API_KEY;
        String clientBaseURL = System.getenv().get("CLIENT_BASE_URL");

        // Start by finding an existing customer record from Stripe or creating a new one if needed
        Customer customer = CustomerUtil.findOrCreateCustomer(requestDTO.getCustomerEmail(), requestDTO.getCustomerName());

        // Next, create a checkout session by adding the details of the checkout
        SessionCreateParams.Builder paramsBuilder =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setCustomer(customer.getId())
                        .setSuccessUrl(clientBaseURL + "/success?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl(clientBaseURL + "/failure");

        for (Product product : requestDTO.getItems()) {
            paramsBuilder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                    PriceData.builder()
                                            .setProductData(
                                                    PriceData.ProductData.builder()
                                                            .putMetadata("app_id", product.getId())
                                                            .setName(product.getName())
                                                            .build()
                                            )
                                            .setCurrency(ProductDAO.getProduct(product.getId()).getDefaultPriceObject().getCurrency())
                                            .setUnitAmountDecimal(ProductDAO.getProduct(product.getId()).getDefaultPriceObject().getUnitAmountDecimal())
                                            .build())
                            .build());
        }



    Session session = Session.create(paramsBuilder.build());

        return session.getUrl();
}}
/*
    @PostMapping("/checkout/integrated")
    String integratedCheckout(@RequestBody RequestDTO requestDTO) throws StripeException {

        Stripe.apiKey = STRIPE_API_KEY;

        // Start by finding an existing customer or creating a new one if needed
        Customer customer = CustomerUtil.findOrCreateCustomer(requestDTO.getCustomerEmail(), requestDTO.getCustomerName());

        PaymentIntent paymentIntent;

        if (!requestDTO.isInvoiceNeeded()) {
            // If the invoice is not needed, create a PaymentIntent directly and send it to the client
            PaymentIntentCreateParams params =
                    PaymentIntentCreateParams.builder()
                            .setAmount(Long.parseLong(calculateOrderAmount(requestDTO.getItems())))
                            .setCurrency("usd")
                            .setCustomer(customer.getId())
                            .setAutomaticPaymentMethods(
                                    PaymentIntentCreateParams.AutomaticPaymentMethods
                                            .builder()
                                            .setEnabled(true)
                                            .build()
                            )
                            .build();

            paymentIntent = PaymentIntent.create(params);
        } else {
            // If invoice is needed, create the invoice object, add line items to it, and finalize it to create the PaymentIntent automatically
            InvoiceCreateParams invoiceCreateParams = new InvoiceCreateParams.Builder()
                    .setCustomer(customer.getId())
                    .build();

            Invoice invoice = Invoice.create(invoiceCreateParams);

            // Add each item to the invoice one by one
            for (Product product : requestDTO.getItems()) {

                // Look for existing Product in Stripe before creating a new one
                Product stripeProduct;

                ProductSearchResult results = Product.search(ProductSearchParams.builder()
                        .setQuery("metadata['app_id']:'" + product.getId() + "'")
                        .build());

                if (results.getData().size() != 0)
                    stripeProduct = results.getData().get(0);
                else {

                    // If a product is not found in Stripe database, create it
                    ProductCreateParams productCreateParams = new ProductCreateParams.Builder()
                            .setName(product.getName())
                            .putMetadata("app_id", product.getId())
                            .build();

                    stripeProduct = Product.create(productCreateParams);
                }

                // Create an invoice line item using the product object for the line item
                InvoiceItemCreateParams invoiceItemCreateParams = new InvoiceItemCreateParams.Builder()
                        .setInvoice(invoice.getId())
                        .setQuantity(1L)
                        .setCustomer(customer.getId())
                        .setPriceData(
                                InvoiceItemCreateParams.PriceData.builder()
                                        .setProduct(stripeProduct.getId())
                                        .setCurrency(ProductDAO.getProduct(product.getId()).getDefaultPriceObject().getCurrency())
                                        .setUnitAmountDecimal(ProductDAO.getProduct(product.getId()).getDefaultPriceObject().getUnitAmountDecimal())
                                        .build())
                        .build();

                InvoiceItem.create(invoiceItemCreateParams);
            }

            // Mark the invoice as final so that a PaymentIntent is created for it
            invoice = invoice.finalizeInvoice();

            // Retrieve the payment intent object from the invoice
            paymentIntent = PaymentIntent.retrieve(invoice.getPaymentIntent());
        }

        // Send the client secret from the payment intent to the client
        return paymentIntent.getClientSecret();
    }


}

 */