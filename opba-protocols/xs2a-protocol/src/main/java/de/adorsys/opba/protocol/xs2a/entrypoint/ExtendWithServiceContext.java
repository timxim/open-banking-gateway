package de.adorsys.opba.protocol.xs2a.entrypoint;

import de.adorsys.opba.protocol.api.dto.context.ServiceContext;
import de.adorsys.opba.protocol.xs2a.service.xs2a.context.Xs2aContext;
import org.springframework.stereotype.Service;

@Service
public class ExtendWithServiceContext {

    public Xs2aContext extend(Xs2aContext context, ServiceContext serviceContext) {
        context.setServiceSessionId(serviceContext.getServiceSessionId());
        context.setRedirectCodeIfAuthContinued(serviceContext.getFutureRedirectCode().toString());
        context.setAuthorizationSessionIdIfOpened(serviceContext.getFutureAuthSessionId().toString());
        return context;
    }
}
