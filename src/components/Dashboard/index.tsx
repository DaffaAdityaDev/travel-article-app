/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useGetArticlesQuery } from '../../services/articleApi';
import { useGetMeQuery } from '../../services/authApi';
import { Article, ArticlesResponse } from '../../types/article';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import styles from './styles.module.css';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard() {
  const { data: userData } = useGetMeQuery();
  const { data: articlesData, isLoading } = useGetArticlesQuery({ 
    page: 1, 
    pageSize: 100,
  });
  
  console.log(articlesData);
  const [articleStats, setArticleStats] = useState({ total: 0, byCategory: {} });
  const [commentStats, setCommentStats] = useState({ total: 0, byArticle: {} });
  const [recentActivity, setRecentActivity] = useState<Array<Article | { type: 'comment', article: Article, createdAt: string }>>([]);

  useEffect(() => {
    if (articlesData) {
      processData(articlesData);
    }
  }, [articlesData]);

  const processData = (articles: ArticlesResponse) => {
    const categoryCount: {[key: string]: number} = {};
    const commentCount: {[key: string]: number} = {};
    let totalComments = 0;

    const allActivity: Array<Article | { type: 'comment', article: Article, createdAt: string }> = [];

    articles.data.forEach((article: Article) => {
      const category = article.category?.name || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      const articleComments = article.comments?.length || 0;
      commentCount[article.title] = articleComments;
      totalComments += articleComments;

      allActivity.push(article);
      // Add recent comments as activity
      article.comments?.forEach((comment: any) => {
        if (comment.createdAt) {
          allActivity.push({ type: 'comment', article, createdAt: comment.createdAt });
        }
      });
    });

    setArticleStats({
      total: articles.data.length,
      byCategory: categoryCount
    });

    setCommentStats({
      total: totalComments,
      byArticle: commentCount
    });

    // Sort all activity by date and take the 5 most recent
    const sortedActivity = allActivity.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRecentActivity(sortedActivity.slice(0, 5));
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        font: {
          size: 16,
        },
      },
    },
  };

  const categoryChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Articles by Category',
      },
    },
  };

  const commentChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Most Commented Articles',
      },
    },
  };

  const categoryChartData = {
    labels: Object.keys(articleStats.byCategory),
    datasets: [
      {
        data: Object.values(articleStats.byCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const commentChartData = {
    labels: Object.entries(commentStats.byArticle)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([title]) => title),
    datasets: [
      {
        label: 'Comments',
        data: Object.entries(commentStats.byArticle)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([, count]) => count as number),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const exportToExcel = () => {
    if (articleStats.total === 0) {
      toast.error('No data available to export');
      return;
    }

    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Travel Article App - Dashboard Summary'],
      ['Generated on:', new Date().toLocaleString()],
      [''],
      ['Total Articles:', articleStats.total],
      ['Total Comments:', commentStats.total],
      [''],
      ['Articles by Category'],
      ['Category', 'Count'],
      ...Object.entries(articleStats.byCategory),
      [''],
      ['Top 5 Most Commented Articles'],
      ['Article Title', 'Comments Count'],
      ...Object.entries(commentStats.byArticle)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5),
      [''],
      ['Recent Activity'],
      ['Type', 'Details', 'Date'],
      ...recentActivity.map(item => [
        'title' in item ? 'New Article' : 'New Comment',
        'title' in item ? item.title : `Comment on: ${item.article.title}`,
        new Date(item.createdAt).toLocaleString()
      ])
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Auto-fit columns for the summary sheet
    const range = XLSX.utils.decode_range(summaryWorksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = summaryWorksheet[XLSX.utils.encode_cell({c: C, r: R})];
        if (cell && cell.v) {
          const cellLength = cell.v.toString().length;
          if (cellLength > max) max = cellLength;
        }
      }
      summaryWorksheet['!cols'] = summaryWorksheet['!cols'] || [];
      summaryWorksheet['!cols'][C] = { width: max + 2 };
    }

    // Add chart to Summary sheet
    const chartRange = {
      s: { c: 0, r: 7 },
      e: { c: 1, r: 7 + Object.keys(articleStats.byCategory).length }
    };
    summaryWorksheet['!charts'] = [{
      type: 'pie',
      title: 'Articles by Category',
      plotarea: { fill: { none: true } },
      series: [{ name: 'Article Count', categories: `A8:A${chartRange.e.r}`, values: `B8:B${chartRange.e.r}` }],
      legend: { position: 'b', show: true },
      chartarea: { border: { none: true } }
    }];

    XLSX.writeFile(workbook, 'travel_article_app_report.xlsx');
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Welcome, {userData?.username || 'User'}!</h1>
        <button onClick={exportToExcel} className={styles.exportButton}>Export Dashboard To Excel</button>
      </div>
      <div className={styles.grid}>
        <div className={`${styles.box} ${styles.statsBox}`}>
          <h2>Total Articles</h2>
          <p className={styles.statNumber}>{articleStats.total}</p>
        </div>
        <div className={`${styles.box} ${styles.statsBox}`}>
          <h2>Total Comments</h2>
          <p className={styles.statNumber}>{commentStats.total}</p>
        </div>
        <div className={`${styles.box} ${styles.chartBox}`}>
          <Doughnut options={categoryChartOptions} data={categoryChartData} />
        </div>
        <div className={`${styles.box} ${styles.chartBox}`}>
          <Pie options={commentChartOptions} data={commentChartData} />
        </div>
        <div className={`${styles.box} ${styles.recentActivityBox}`}>
          <h2>Recent Activity</h2>
          <ul className={styles.activityList}>
            {recentActivity.map((item, index) => (
              <li key={index} className={styles.activityItem}>
                {'title' in item ? (
                  <span>New article: {item.title}</span>
                ) : (
                  <span>New comment on: {item.article.title}</span>
                )}
                <span className={styles.activityDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;