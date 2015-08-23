package info.igreque.keepmecontributing.github;

import java.util.HashMap;
import java.io.FileInputStream;

import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.client.HttpClient;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.DefaultHttpResponseFactory;
import org.apache.http.protocol.BasicHttpContext;

import org.junit.Test;
import org.junit.Before;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;

import static info.igreque.keepmecontributing.testhelper.HttpGetMatcher.requestsUrlByGet;

/**
 * Unit test for Github API client class
 */
public class GithubTest {
  private Github describedInstance;

  private String username = "igrep";
  private HttpClient httpClient = mock(HttpClient.class, RETURNS_DEEP_STUBS);

  @Before
  public void setUp(){
    describedInstance = new Github(username, httpClient);
  }

  public HttpResponse whenContributionsCalendarSvgAvailable()
    throws Exception
  {
    HttpResponse response = DefaultHttpResponseFactory.INSTANCE.newHttpResponse(
      HttpVersion.HTTP_1_1, 200, new BasicHttpContext()
    );
    response.setEntity(new StringEntity("<svg></svg>"));

    when(
      httpClient.execute(requestsUrlByGet("https://github.com/users/" + username + "/contributions"))
    ).thenReturn(response);
    return response;
  }

  @Test
  public void fetchesContributionsSvg() throws Exception {
    HttpResponse response = whenContributionsCalendarSvgAvailable();
    assertThat("returns the response from github.com as is",
      describedInstance.fetchContributionsCalendarSvg(), is(response)
    );
  }

  @Test
  public void convertsContributionsSvgToMap() throws Exception {
    @SuppressWarnings("ConstantConditions")
    HashMap<String, Contributions> result = describedInstance.contributionsCalendarFromSvg(
      new FileInputStream(
        Github.class.getClassLoader().getResource("contributions-2015-08-22.svg").getPath()
      )
    );
    assertThat("returns a map containing the latest contributions count",
      result.get("2015-08-22").length, is(1000)
    );
  }
}
