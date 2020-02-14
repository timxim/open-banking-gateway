package de.adorsys.opba.protocol.facade.config;

import java.security.Provider;

public class FacadeSecurityProvider extends Provider {
    public FacadeSecurityProvider(String name, double version, String info) {
        super(name, version, info);
    }
}
