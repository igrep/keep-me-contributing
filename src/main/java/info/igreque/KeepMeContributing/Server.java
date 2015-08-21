package info.igreque.KeepMeContributing;

import java.io.File;

import static spark.Spark.*;

/**
 * Server application for keep-me-contributing.
 * Download an svg representing my contribution calendar
 * from https://github.com/users/igrep/contributions.
 * Then convert it to a JSON.
 */
public class Server
{

    public static void main(String[] args)
    {
        externalStaticFileLocation(args[0]);
        port(Integer.parseInt(args[1], 10));

        get("/users/:name/contributions", (request, response) -> {
            return "TODO: Implement";
        });
    }
}
