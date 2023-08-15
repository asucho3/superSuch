import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";

function DashboardCard({ array, link, period }) {
  return (
    <div>
      <Card sx={{ padding: "1rem" }}>
        <CardContent>
          {array &&
            array.map((magnitude, index) => {
              return (
                <div
                  className={index === array.length - 1 ? "" : "mb-4"}
                  key={index}
                >
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {magnitude.title}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {magnitude.value}
                  </Typography>
                  {/* {period && (
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {period === 1
                        ? "Last 24hs"
                        : period === 7
                        ? "Last week"
                        : period === 30
                        ? "Last month"
                        : period === 90
                        ? "Last 3 months"
                        : period === 365
                        ? "Last year"
                        : period === 9999
                        ? "All time"
                        : ""}
                    </Typography>
                  )} */}
                </div>
              );
            })}
        </CardContent>
        {link && (
          <CardActions>
            <Button size="small">{link}</Button>
          </CardActions>
        )}
      </Card>
    </div>
  );
}

export default DashboardCard;
