package info.igreque.keepmecontributing;

import info.igreque.keepmecontributing.github.Github;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import static spark.Spark.*;

/**
 * Server application for keep-me-contributing.
 * Download an svg representing my contributions calendar
 * from https://github.com/users/igrep/contributions.
 * Then convert it to a JSON.
 */
public class Server {
  public static void main(String[] args){
    externalStaticFileLocation(args[0]);
    port(Integer.parseInt(args[1], 10));

    buildEntryPointFor("igrep");
    //buildEntryPointFor("some-test-users");
  }

  /**
   * Used to restrict users that this program gets his/her contributions via GitHub private endpoint.
   * Intended to reduce accesses to this server (and GitHub) by the users except me:
   * Maybe they are not always interested in my contributions.
   * @param username GitHub username.
   */
  private static void buildEntryPointFor(String username){
    get("/users/" + username + "/contributions", (request, response) -> {
      CloseableHttpClient httpClient = HttpClients.createDefault();
      CloseableHttpResponse responseFromGithub = null;
      try {
        responseFromGithub = (CloseableHttpResponse)
          new Github(username, httpClient).fetchContributionsCalendarSvg();

        response.status(responseFromGithub.getStatusLine().getStatusCode());
        response.type("text/html; charset=utf-8"); // same as original.
        return EntityUtils.toString(responseFromGithub.getEntity());
      } finally {
        if (responseFromGithub != null){
          responseFromGithub.close();
        }
      }
    });
    get("/users/" + username + "/contributions.json", (request, response) -> {
      return "TODO: Implement";
    });
  }

}
