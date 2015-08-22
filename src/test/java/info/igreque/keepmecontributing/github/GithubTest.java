package info.igreque.keepmecontributing.github;

import java.util.HashMap;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.junit.Test;
import org.junit.Before;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

import info.igreque.keepmecontributing.github.Github;
import info.igreque.keepmecontributing.github.Contributions;

/**
 * Unit test for Github API client class
 */
public class GithubTest {
  private Github describedInstance;

  @Before
  public void setUp(){
    describedInstance = new Github("igrep", null);
  }

  @Test
  public void fetchesContributionsSvg(){
    assertEquals("The truth", 1, 1);
  }

  @Test
  public void convertsContributionsSvgToMap() throws Exception {
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
