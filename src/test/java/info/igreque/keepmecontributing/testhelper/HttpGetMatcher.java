package info.igreque.keepmecontributing.testhelper;

import org.mockito.ArgumentMatcher;
import static org.mockito.Matchers.argThat;
import org.apache.http.client.methods.HttpGet;

import org.hamcrest.Description;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Custom matcher for verifying the given request accesses to specified URL.
 */
public class HttpGetMatcher extends ArgumentMatcher<HttpGet> {

  private final URI expectedUrl;
  private URI actualUrl;

  public HttpGetMatcher(String expectedUrl) throws URISyntaxException{
    this.expectedUrl = new URI(expectedUrl);
  }

  @Override
  public boolean matches(Object actual) {
    actualUrl = ((HttpGet) actual).getURI();
    return actualUrl.equals(expectedUrl);
  }

  @Override
  public void describeTo(Description description) {
    description.appendText("Accessing to unexpected URL: " + actualUrl.toString());
    description.appendText("               expected URL: " + expectedUrl.toString());
  }

  /**
   * Convenience factory method for using the custom ValueObject matcher.
   */
  public static HttpGet requestsUrlByGet(String expectedUrl) throws URISyntaxException {
    return argThat(new HttpGetMatcher(expectedUrl));
  }
}
